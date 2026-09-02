#!/usr/bin/env bash
# Mete las credenciales de EmailJS en Vercel sin que aparezcan en pantalla.
#
# Cada valor se copia al portapapeles y se lee con pbpaste, así que no se teclea
# en la terminal, no queda en el historial de la shell y no pasa por ningún
# fichero temporal. Es el mismo procedimiento que se usó con la clave de Twenty.
#
#   Uso:  bash scripts/emailjs-env.sh
set -euo pipefail
cd "$(dirname "$0")/.."

pon() {
  local nombre="$1" donde="$2"
  echo
  echo "── $nombre"
  echo "   $donde"
  read -r -p "   Cópialo al portapapeles y pulsa Enter (o 's' para saltar): " r
  [ "$r" = "s" ] && { echo "   saltada"; return; }
  local v; v="$(pbpaste)"
  if [ -z "$v" ]; then echo "   ✗ el portapapeles está vacío, no se toca"; return; fi
  echo "   longitud leída: ${#v} caracteres"
  vercel env rm "$nombre" production --yes >/dev/null 2>&1 || true
  printf '%s' "$v" | vercel env add "$nombre" production >/dev/null
  echo "   ✓ guardada en Vercel (production)"
}

echo "Credenciales de EmailJS → Vercel"
echo "═══════════════════════════════"
pon EMAILJS_SERVICE_ID  "Email Services → el servicio conectado → Service ID"
pon EMAILJS_TEMPLATE_ID "Email Templates → tu plantilla → Template ID"
pon EMAILJS_PUBLIC_KEY  "Account → General → Public Key"
pon EMAILJS_PRIVATE_KEY "Account → General → Private Key"
pon STUDIO_EMAIL        "El correo donde quieres recibir los avisos"

echo
echo "Listo. Ahora: vercel --prod --yes"
