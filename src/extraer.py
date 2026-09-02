# -*- coding: utf-8 -*-
"""Saca del HTML ya generado todo lo que un lector llega a ver.

Se extrae de la página construida y no del código fuente a propósito: así el
conjunto es exactamente el que aparece en pantalla, ni una cadena de más (las
que el código define pero no usa) ni una de menos (las que se arman juntando
trozos). Si algo no sale aquí, es que no se ve.

Cubre tres sitios donde vive el texto:

  · nodos de texto, saltándose <script> y <style>
  · atributos que el usuario lee o escucha (alt, placeholder, aria-label…)
  · literales de cadena dentro del JS embebido, que es donde están los
    cuestionarios enteros

Lo de los literales de JS es lo más delicado: se aceptan sólo los que están
completos entre comillas y no parecen código (sin `<`, sin `${`, sin pinta de
selector o de clase CSS). Lo que no pasa el filtro se queda en español, y el
detector de `revisar.py` lo canta.
"""
import json
import os
import re
import sys
from html.parser import HTMLParser

ATRIBUTOS = {"alt", "title", "placeholder", "aria-label", "aria-description"}
OPACOS = {"script", "style"}
ES_BUNDLE = re.compile(r"window\.BORSOGA_I18N\s*=\s*Object\.assign")

# Sólo se traduce lo que parece una frase: al menos una letra, y no un token
# suelto de código que se haya colado.
LETRA = re.compile(r"[A-Za-zÁÉÍÓÚÑáéíóúñü]")
CODIGO = re.compile(r"[<>{}]|^\s*[.#][\w-]+\s*$|^[\w-]+:[\w-]+$|^https?://|^/|^\d+(px|%|em|vw|s)$")


def _vale(s):
    s = s.strip()
    if len(s) < 2 or not LETRA.search(s):
        return False
    if CODIGO.search(s):
        return False
    return True


class Cosecha(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.textos = []
        self.dentro = []

    def handle_starttag(self, tag, attrs):
        if tag in OPACOS:
            self.dentro.append(tag)
        for k, v in attrs:
            if k in ATRIBUTOS and v and _vale(v):
                self.textos.append(v.strip())

    def handle_endtag(self, tag):
        if self.dentro and self.dentro[-1] == tag:
            self.dentro.pop()

    def handle_data(self, data):
        if self.dentro:
            # El bundle de i18n se salta entero: su rama `opt` está indexada por
            # la cadena española, así que sus claves parecen texto sin traducir
            # cuando en realidad son el índice de la traducción. Se reconoce por
            # la asignación, no por el nombre: los cuestionarios *leen*
            # BORSOGA_I18N, y buscar el identificador a secas hacía que sus
            # scripts se saltaran enteros y el informe diera cero en falso.
            if self.dentro[-1] == "script" and not ES_BUNDLE.search(data):
                self.textos.extend(literales_js(data))
            return
        for trozo in data.split("\n"):
            if _vale(trozo):
                self.textos.append(trozo.strip())


def literales_js(src):
    """Literales de cadena de un bloque de JS, en comillas simples o dobles.

    No se interpreta el JS: basta con reconocer la comilla de apertura, respetar
    los escapes y parar en la de cierre. Los literales con `${`, etiquetas HTML
    o pinta de selector se descartan —son plantillas y código, no texto.
    """
    fuera = []
    for m in re.finditer(r"""(['"])((?:\\.|(?!\1)[^\\\n])*)\1""", src):
        try:
            v = json.loads('"' + m.group(2).replace('"', '\\"').replace("\\'", "'") + '"')
        except Exception:
            continue
        if _vale(v):
            fuera.append(v)
    return fuera


def de_html(ruta):
    p = Cosecha()
    p.feed(open(ruta, encoding="utf-8").read())
    return p.textos


ESPANOL = re.compile(
    r"[áéíóúñü¿¡]"
    r"|\b(el|la|los|las|un|una|unos|unas|de|del|que|con|para|por|sin|como|más|"
    r"tu|tus|te|se|su|sus|es|son|está|están|hay|no|y|o|pero|si|cuando|donde|"
    r"cada|todo|toda|todos|todas|nos|lo|al|desde|hasta|entre|sobre|ya|muy)\b",
    re.I)


def parece_espanol(s):
    """¿Esta cadena sigue en español?

    Heurística deliberadamente ruidosa: acentos, o dos o más palabras funcionales
    españolas *distintas*. Con una sola no basta —"no", "si", "o" y "la" existen
    en inglés y en nombres propios— y contar repeticiones tampoco: una frase
    inglesa con dos "no" no está en español. Prefiero que se me escape alguna
    antes que marcar media página en inglés como pendiente.
    """
    if re.search(r"[áéíóúñü¿¡]", s, re.I):
        return True
    return len({m.lower() for m in ESPANOL.findall(s)}) >= 2


def sin_traducir(directorio="build/en"):
    """Texto de las páginas de un idioma que coincide con una cadena española.

    Complementa a `parece_espanol()`, que se guía por acentos y palabras
    funcionales y por eso no ve frases cortas y limpias como "Alta gama" o
    "Contexto urbano". Aquí no se adivina: si lo que se pinta es exactamente una
    cadena del diccionario español y no tiene traducción, está sin traducir.
    """
    import i18n_load as L
    es = set(L.cadenas(L.ORIGEN)["opt"]) | {
        v for r in ("ui", "msg") for v in L.cadenas(L.ORIGEN)[r].values() if isinstance(v, str)}
    fuera = set()
    for lang in (l for l in L.IDIOMAS if l != L.ORIGEN):
        d = L.cadenas(lang)
        for raiz, _, fs in os.walk(directorio):
            for f in fs:
                if not f.endswith(".html"):
                    continue
                for t in de_html(os.path.join(raiz, f)):
                    if t in es and d["opt"].get(t) in (None, t) and t not in L.IGUALES:
                        fuera.add(t)
    return sorted(fuera)


if __name__ == "__main__":
    raiz = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "build")
    objetivo = sys.argv[1:] or ["."]
    vistos, orden = set(), []
    for base in objetivo:
        for dir_, _, fs in os.walk(os.path.join(raiz, base)):
            if "/en" in dir_ or dir_.endswith("/assets"):
                continue
            for f in fs:
                if not f.endswith(".html"):
                    continue
                for s in de_html(os.path.join(dir_, f)):
                    if s not in vistos and parece_espanol(s):
                        vistos.add(s)
                        orden.append(s)
    print(f"# {len(orden)} cadenas en español", file=sys.stderr)
    for s in orden:
        print(json.dumps(s, ensure_ascii=False))
