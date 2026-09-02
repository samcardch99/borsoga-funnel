#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Servidor de desarrollo para el sitio de planes.

    python3 src/dev.py [--port 4321] [--open]

Qué hace:
  · Construye `build/` al arrancar.
  · Vigila `src/*.py` y reconstruye en cuanto guardas.
  · Recarga el navegador solo, por SSE, y **conserva la posición del scroll**
    (las páginas son largas; recargar al principio cada vez es insufrible).
  · Si el build falla, muestra el traceback superpuesto en la propia página en
    vez de dejarte con la versión vieja sin avisar.

El script de recarga se inyecta **al vuelo en la respuesta**, no en el build.
Así lo que hay en `build/` es byte a byte lo que se sube a producción: el dev
server no puede contaminar el artefacto que se despliega.

Sin dependencias externas: solo la librería estándar.
"""
import argparse
import functools
import http.server
import json
import os
import queue
import socketserver
import subprocess
import sys
import threading
import time
import webbrowser

SRC = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(SRC)
BUILD = os.path.join(ROOT, "build")
POLL = 0.3

_clients = []
_clients_lock = threading.Lock()
_state = {"version": 0, "error": None}

# El cliente reconecta solo si el servidor se reinicia, y restaura el scroll.
LIVE_RELOAD = """
<script>
(function () {
  var KEY = '__dev_scroll__';
  try {
    var y = sessionStorage.getItem(KEY);
    if (y !== null) {
      sessionStorage.removeItem(KEY);
      addEventListener('load', function () { scrollTo(0, parseFloat(y)); });
    }
  } catch (e) {}

  function overlay(text) {
    var el = document.getElementById('__dev_err__');
    if (!text) { if (el) el.remove(); return; }
    if (!el) {
      el = document.createElement('pre');
      el.id = '__dev_err__';
      el.style.cssText = 'position:fixed;inset:0;z-index:99999;margin:0;padding:28px;' +
        'background:#111;color:#ff6b6b;font:13px/1.55 ui-monospace,SFMono-Regular,Menlo,monospace;' +
        'white-space:pre-wrap;overflow:auto';
      document.body.appendChild(el);
    }
    el.textContent = 'Fallo al construir\\n\\n' + text;
  }

  var es = new EventSource('/__dev/events');
  var seen = null;
  es.onmessage = function (ev) {
    var d = JSON.parse(ev.data);
    if (d.error) { overlay(d.error); seen = d.version; return; }
    overlay(null);
    if (seen === null) { seen = d.version; return; }
    if (d.version !== seen) {
      try { sessionStorage.setItem(KEY, String(scrollY)); } catch (e) {}
      location.reload();
    }
  };
})();
</script>
"""


def build():
    """Reconstruye en un subproceso: el build usa estado a nivel de módulo y
    reimportarlo en caliente daría resultados obsoletos."""
    p = subprocess.run([sys.executable, "build.py"], cwd=SRC,
                       capture_output=True, text=True)
    if p.returncode == 0:
        return None, p.stdout.strip()
    return (p.stderr or p.stdout).strip(), ""


def notify():
    payload = json.dumps({"version": _state["version"], "error": _state["error"]})
    with _clients_lock:
        for q in list(_clients):
            q.put(payload)


def snapshot():
    out = {}
    for f in os.listdir(SRC):
        if f.endswith(".py") and f != "dev.py":
            try:
                out[f] = os.stat(os.path.join(SRC, f)).st_mtime
            except OSError:
                pass
    return out


def watcher():
    last = snapshot()
    while True:
        time.sleep(POLL)
        now = snapshot()
        if now == last:
            continue
        changed = sorted(set(now) - set(last) |
                         {f for f in now if f in last and now[f] != last[f]})
        last = now
        t0 = time.time()
        err, out = build()
        ms = int((time.time() - t0) * 1000)
        _state["version"] += 1
        _state["error"] = err
        if err:
            print(f"\n  ✗ {', '.join(changed)} — fallo del build\n")
            print("   " + err.replace("\n", "\n   "))
        else:
            print(f"  ↻ {', '.join(changed)} → reconstruido en {ms} ms")
        notify()


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=BUILD, **kw)

    def log_message(self, fmt, *args):
        code = args[1] if len(args) > 1 else ""
        if str(code).startswith(("4", "5")):
            print(f"  {code} {self.path}")

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        super().end_headers()

    def do_GET(self):
        if self.path.startswith("/__dev/events"):
            return self.sse()
        return super().do_GET()

    def sse(self):
        self.send_response(200)
        self.send_header("Content-Type", "text/event-stream")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Connection", "keep-alive")
        self.end_headers()
        q = queue.Queue()
        with _clients_lock:
            _clients.append(q)
        try:
            q.put(json.dumps({"version": _state["version"], "error": _state["error"]}))
            while True:
                try:
                    msg = q.get(timeout=15)
                except queue.Empty:
                    self.wfile.write(b": ping\n\n")   # mantiene viva la conexión
                    self.wfile.flush()
                    continue
                self.wfile.write(f"data: {msg}\n\n".encode())
                self.wfile.flush()
        except (BrokenPipeError, ConnectionResetError):
            pass
        finally:
            with _clients_lock:
                if q in _clients:
                    _clients.remove(q)

    def send_head(self):
        """Inyecta el cliente de recarga solo en las respuestas HTML."""
        path = self.translate_path(self.path)
        if os.path.isdir(path):
            path = os.path.join(path, "index.html")
        if not path.endswith(".html") or not os.path.isfile(path):
            return super().send_head()
        body = open(path, "rb").read()
        if b"</body>" in body:
            body = body.replace(b"</body>", LIVE_RELOAD.encode() + b"</body>", 1)
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        import io
        return io.BytesIO(body)


class Server(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True

    def handle_error(self, request, client_address):
        # Cerrar una pestaña corta el SSE a media escritura. Es normal, no un
        # fallo: no ensuciamos el log con el traceback.
        exc = sys.exc_info()[0]
        if exc in (BrokenPipeError, ConnectionResetError):
            return
        super().handle_error(request, client_address)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--port", type=int, default=4380)
    ap.add_argument("--open", action="store_true", help="abre el navegador al arrancar")
    args = ap.parse_args()

    err, out = build()
    _state["error"] = err
    if err:
        print("  ✗ el build inicial falló:\n")
        print("   " + err.replace("\n", "\n   "))
    else:
        for line in out.splitlines():
            print("  " + line.strip())

    threading.Thread(target=watcher, daemon=True).start()

    base = f"http://localhost:{args.port}"
    print(f"""
  Borsoga · dev server
  ────────────────────────────────────────────
  {base}/                        inicio
  {base}/diseno-web/             planes web
  {base}/diseno-grafico/         planes gráfico
  {base}/interior-design/          interior design
  {base}/politica-de-privacidad/ legal

  Vigilando src/*.py — guarda y el navegador se recarga solo.
  Ctrl+C para parar.
""")
    # En macOS `localhost` resuelve a ::1 antes que a 127.0.0.1. Si otro
    # proceso escucha en IPv6 en el mismo puerto, se lo come todo y parece
    # que nuestro servidor devuelve 404. Avisamos en vez de dejar el misterio.
    try:
        import socket
        s6 = socket.socket(socket.AF_INET6, socket.SOCK_STREAM)
        s6.settimeout(0.4)
        if s6.connect_ex(("::1", args.port)) == 0:
            print(f"  ⚠ otro proceso escucha en [::1]:{args.port} — usa http://127.0.0.1:{args.port}")
            print(f"    o arranca con otro puerto: python3 src/dev.py --port {args.port + 1}")
        s6.close()
    except OSError:
        pass

    if args.open:
        webbrowser.open(base + "/")

    try:
        with Server(("127.0.0.1", args.port), Handler) as httpd:
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n  parado.")
    except OSError as e:
        print(f"  ✗ no se pudo abrir el puerto {args.port}: {e}")
        print(f"    prueba con: python3 src/dev.py --port {args.port + 1}")
        sys.exit(1)


if __name__ == "__main__":
    main()
