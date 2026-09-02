# -*- coding: utf-8 -*-
"""Escribe entradas en la rama `opt` de un fichero de i18n.

Existe porque anteponerlas no basta: en un literal de objeto de JavaScript, si
una clave aparece dos veces gana la última. Al insertar traducciones al
principio de `opt`, las entradas viejas que quedaban más abajo —muchas todavía
en español— las pisaban, y la página seguía saliendo en español aunque el
diccionario pareciera correcto. Aquí se reemplaza cada clave en su sitio y sólo
se añade al final lo que de verdad es nuevo.
"""
import json
import re


def _limites(texto, rama="opt"):
    """(inicio, fin) del contenido de la rama, sin las llaves."""
    m = re.search(r"\n\s*" + rama + r"\s*:\s*\{", texto)
    if not m:
        raise ValueError(f"no se encontró la rama {rama}")
    ini = m.end()
    prof, i = 1, ini
    while i < len(texto):
        c = texto[i]
        if c in "\"'":                      # las cadenas se saltan enteras
            comilla, i = c, i + 1
            while i < len(texto):
                if texto[i] == "\\":
                    i += 2
                    continue
                if texto[i] == comilla:
                    i += 1
                    break
                i += 1
            continue
        if c == "{":
            prof += 1
        elif c == "}":
            prof -= 1
            if prof == 0:
                return ini, i
        i += 1
    raise ValueError(f"la rama {rama} no cierra")


def escribir(ruta, pares, rama="opt"):
    """Aplica `pares` a la rama. Devuelve (reemplazadas, añadidas)."""
    s = open(ruta, encoding="utf-8").read()
    ini, fin = _limites(s, rama)
    cuerpo = s[ini:fin]
    repuestas, nuevas = 0, {}
    for k, v in pares.items():
        pat = re.compile(r'(\n[ \t]*' + re.escape(json.dumps(k, ensure_ascii=False)) + r'\s*:\s*)"(?:[^"\\]|\\.)*"')
        cuerpo, n = pat.subn(lambda m: m.group(1) + json.dumps(v, ensure_ascii=False), cuerpo)
        if n:
            repuestas += n
        else:
            nuevas[k] = v
    if nuevas:
        cola = "".join(f'    {json.dumps(k, ensure_ascii=False)}: {json.dumps(v, ensure_ascii=False)},\n'
                       for k, v in sorted(nuevas.items()))
        cuerpo = cuerpo.rstrip() + ("," if cuerpo.rstrip() and not cuerpo.rstrip().endswith(",") else "") + "\n" + cola
    open(ruta, "w", encoding="utf-8").write(s[:ini] + cuerpo + s[fin:])
    return repuestas, len(nuevas)


def duplicadas(ruta, rama="opt"):
    """Claves repetidas dentro de la rama. La última gana, así que avisan de un
    diccionario que miente sobre lo que se va a ver."""
    s = open(ruta, encoding="utf-8").read()
    ini, fin = _limites(s, rama)
    vistas, repes = set(), set()
    for m in re.finditer(r'\n[ \t]*("(?:[^"\\]|\\.)*")\s*:\s*"', s[ini:fin]):
        k = json.loads(m.group(1))
        (repes if k in vistas else vistas).add(k)
    return sorted(repes)
