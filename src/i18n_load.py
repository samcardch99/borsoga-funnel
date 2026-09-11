# -*- coding: utf-8 -*-
"""Lee las cadenas de i18n/<lang>.js en tiempo de construcción.

Las páginas del diseño están enteramente escritas en claves (`t.ui.av_p1_i1`),
así que en vez de transcribir textos a Python los resolvemos desde el mismo
fichero que edita el diseñador. Una sola fuente: si cambia una frase allí,
cambia aquí al reconstruir.

No se interpreta JavaScript: se extraen los pares clave/valor con una
expresión regular sobre el literal. Es frágil ante formatos raros, pero el
fichero lo genera siempre la misma herramienta y el build avisa si una clave
pedida no existe.

El idioma es global y se conmuta con `usar()`. Ningún módulo llama a `t()` al
importarse —está comprobado con el AST en el build—, así que basta con fijar el
idioma antes de invocar cada `page()` para obtener la misma página en otra
lengua. El español es siempre el origen: si una clave falta en otro idioma se
cae a la española en vez de dejar un hueco, y se anota para que el build lo
cante.
"""
import json
import os
import re

_SRC = os.path.dirname(os.path.abspath(__file__))
IDIOMAS = ("es", "en")
ORIGEN = "es"

# Claves cuya traducción es quedarse igual (nombres propios, marcas, números).
IGUALES = {l.strip() for l in
           open(os.path.join(_SRC, "i18n", "IGUALES.txt"), encoding="utf-8")
           if l.strip() and not l.startswith("#")}

_cache = {}
_FALTAN = set()
_SIN_TRADUCIR = set()
_actual = ORIGEN


RAMAS = ("ui", "msg", "opt", "plural")


def _cargar(lang):
    """Lee el fichero por ramas: ui, msg, opt y plural.

    Antes se aplanaba todo en un solo diccionario con una expresión regular, y
    funcionaba mientras las claves fueran nombres únicos. Dejó de valer al usar
    `opt`, que está indexado por la cadena española: "Balcón o terraza" existe a
    la vez en `opt` y en `plural` con valores distintos, y la última leída
    pisaba a la otra. Se recorre el literal siguiendo la profundidad de llaves,
    saltándose las que van dentro de una cadena, para saber en qué rama cae
    cada par.
    """
    return _ramas(open(os.path.join(_SRC, "i18n", f"{lang}.js"), encoding="utf-8").read())


def _ramas(raw):
    """Saca las cuatro ramas del literal, venga de donde venga."""
    fuera = {r: {} for r in RAMAS}
    rama, prof_rama, prof, i, n = None, 0, 0, 0, len(raw)
    while i < n:
        c = raw[i]
        if c in "\"'":                                  # cadena: se salta entera
            fin = _fin_cadena(raw, i)
            if rama and prof == prof_rama:
                par = _par(raw, i)
                if par:
                    fuera[rama][par[0]] = par[1]
                    i = par[2]
                    continue
            i = fin
            continue
        if c == "{":
            prof += 1
            i += 1
            continue
        if c == "}":
            if rama and prof == prof_rama:
                rama = None
            prof -= 1
            i += 1
            continue
        m = re.match(r"(" + "|".join(RAMAS) + r")\s*:\s*\{", raw[i:])
        if m and _suelta(raw, i):
            rama, prof = m.group(1), prof + 1
            prof_rama = prof
            i += m.end()
            continue
        # Clave sin comillas: es.js las entrecomilla todas, pero los diccionarios
        # que vienen del diseño escriben `dw_s1: 'Tu proyecto'`.
        if rama and prof == prof_rama and _suelta(raw, i):
            m = re.match(r"([A-Za-z_$][\w$]*)\s*:\s*[\"']", raw[i:])
            if m:
                ini_v = i + m.end() - 1
                fin_v = _fin_cadena(raw, ini_v)
                fuera[rama][m.group(1)] = _texto(raw, ini_v, fin_v)
                i = fin_v
                continue
        i += 1
    return fuera


def _suelta(raw, i):
    """¿Empieza aquí una palabra, y no en mitad de otra?"""
    return i == 0 or (not raw[i - 1].isalnum() and raw[i - 1] not in "_$")


def _fin_cadena(raw, i):
    """Índice justo detrás de la cadena que empieza en `i`."""
    comilla, j = raw[i], i + 1
    while j < len(raw):
        if raw[j] == "\\":
            j += 2
            continue
        if raw[j] == comilla:
            return j + 1
        j += 1
    return len(raw)


def _texto(raw, ini, fin):
    """Decodifica el literal que ocupa de `ini` a `fin`.

    El cuerpo de una cadena en comillas dobles ya es válido como cuerpo JSON, así
    que se pasa tal cual. En las de comillas simples hay que deshacer `\\'` —que
    JSON no conoce— y escapar las comillas dobles que estén crudas. Escapar a
    ciegas rompía los textos que traen HTML con atributos entrecomillados.
    """
    comilla = raw[ini]
    cuerpo = raw[ini + 1:fin - 1]
    if comilla == "'":
        cuerpo = re.sub(r'(?<!\\)"', r'\\"', cuerpo.replace("\\'", "'"))
    return json.loads('"' + cuerpo + '"')


def _par(raw, i):
    """Si en `i` empieza un par "clave": "valor", lo devuelve con el índice final."""
    fin_k = _fin_cadena(raw, i)
    m = re.match(r"\s*:\s*[\"']", raw[fin_k:])
    if not m:
        return None
    ini_v = fin_k + m.end() - 1
    fin_v = _fin_cadena(raw, ini_v)
    return _texto(raw, i, fin_k), _texto(raw, ini_v, fin_v), fin_v


def cadenas(lang):
    if lang not in _cache:
        _cache[lang] = _cargar(lang)
    return _cache[lang]


# Cuestionarios que traen su propio diccionario (i18n/dw.js, i18n/gd.js). Son
# copias literales de los del proyecto de diseño, con los dos idiomas dentro del
# mismo fichero: `var ES = {...}` y `var EN = {...}`. Se quedan aparte en vez de
# fundirse en es.js/en.js por dos razones: así se vuelven a sincronizar con el
# diseño copiando el fichero, y sus cadenas —cientos, y solo suyas— no engordan
# el bundle de las páginas que no las usan.
_extra = {}


def extra(nombre, lang):
    """Cadenas de un diccionario propio, en el idioma pedido."""
    if nombre not in _extra:
        raw = open(os.path.join(_SRC, "i18n", f"{nombre}.js"), encoding="utf-8").read()
        _extra[nombre] = {l: _ramas(_bloque(raw, v)) for l, v in (("es", "ES"), ("en", "EN"))}
    return _extra[nombre].get(lang) or _extra[nombre][ORIGEN]


def _bloque(raw, var):
    """El literal de `var <NOMBRE> = { … }`, con sus llaves emparejadas.

    Se recorta antes de analizarlo porque el fichero trae los dos idiomas
    seguidos: pasarlo entero al lector de ramas mezclaría el español con el
    inglés bajo la misma clave.
    """
    m = re.search(r"\bvar\s+" + var + r"\s*=\s*\{", raw)
    if not m:
        raise ValueError(f"el diccionario no declara {var}")
    ini, prof, i, n = m.end() - 1, 0, m.end() - 1, len(raw)
    while i < n:
        c = raw[i]
        if c in "\"'":
            i = _fin_cadena(raw, i)
            continue
        if c == "{":
            prof += 1
        elif c == "}":
            prof -= 1
            if prof == 0:
                return raw[ini:i + 1]
        i += 1
    raise ValueError(f"el bloque {var} no se cierra")


def usar(lang):
    """Fija el idioma de las siguientes llamadas a `t()` y `T()`."""
    global _actual
    if lang not in IDIOMAS:
        raise ValueError(f"idioma desconocido: {lang}")
    _actual = lang


def idioma():
    return _actual


def _buscar(lang, key, ramas=("ui", "msg")):
    d = cadenas(lang)
    for r in ramas:
        if key in d[r]:
            return d[r][key]
    return None


def T(texto):
    """Traduce por la cadena española de origen, estilo gettext.

    Para el texto que vive dentro del código (listas de content.py, filas de
    tablas) y que no tiene nombre de clave. El índice es el español, así que el
    valor que viaja al servidor no cambia: sólo cambia lo que se lee.
    """
    # Las tablas mezclan texto con True/False/None para las celdas de sí y no.
    if not isinstance(texto, str) or not texto.strip() or _actual == ORIGEN:
        return texto
    v = cadenas(_actual)["opt"].get(texto)
    if v is None or v == texto:
        # Sólo se anota lo que de verdad sigue en español. Mucho texto llega
        # aquí ya traducido —salió de `t()` por clave y vuelve a pasar por el
        # render—, y anotarlo llenaría el informe de falsos pendientes.
        from extraer import parece_espanol
        if parece_espanol(texto):
            _SIN_TRADUCIR.add((_actual, texto))
        return cadenas(ORIGEN)["opt"].get(texto, texto)
    return v


def t(key, fallback=None):
    """Devuelve la cadena en el idioma activo.

    Si falta en ese idioma pero existe en español, devuelve la española y lo
    apunta: es preferible una frase en el idioma de origen a un hueco, y así el
    informe del build dice exactamente qué queda por traducir.
    """
    v = _buscar(_actual, key)
    if v is not None:
        if _actual != ORIGEN and key not in IGUALES and v == _buscar(ORIGEN, key):
            _SIN_TRADUCIR.add((_actual, key))
        return v
    base = _buscar(ORIGEN, key)
    if base is not None:
        _FALTAN.add((_actual, key))
        return base
    _FALTAN.add((_actual, key))
    return fallback if fallback is not None else f"‹{key}›"


def faltantes():
    return sorted(_FALTAN)


def sin_traducir():
    return sorted(_SIN_TRADUCIR)
