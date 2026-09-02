# Estado de la traducción al inglés

**No queda ninguna cadena pendiente.** Este fichero listaba las 254 claves que
seguían en español; se cerraron todas.

- `ui` 563 · `msg` 177 · `plural` 22 claves, iguales en los dos idiomas
- `opt` 132 en español (el índice) y 807 en inglés: está indexado por la
  cadena española, así que en español `T()` devuelve la clave tal cual y sólo el
  inglés necesita entradas
- 85 claves declaradas en `IGUALES.txt` cuya traducción correcta es
  quedarse igual (nombres propios, marcas, números)

## Cómo se comprueba

    python3 -c "import sys;sys.path.insert(0,'src');import extraer;print(extraer.sin_traducir())"

Devuelve el texto de las páginas inglesas que coincide exactamente con una
cadena del diccionario español y no tiene traducción. El build además avisa por
su cuenta de lo que pasa por `T()` sin encontrar equivalente.

Los cuestionarios conservan los valores en español dentro del código **a
propósito**: son el valor canónico que compara `api/submit.ts`. Se traducen al
pintarse, con `lbl()`, no en el dato.
