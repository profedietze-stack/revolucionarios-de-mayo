# Revolucionarios de Mayo

Juego educativo sobre la Revolución de Mayo de 1810. Desarrollado por **ProfeD.**

## Distribución — GitHub Pages

Este repositorio contiene **3 archivos**:

| Archivo | Descripción |
|---|---|
| `index.html` | El juego completo (autocontenido) |
| `sw.js` | Service Worker — habilita modo offline |
| `manifest.json` | Web App Manifest — permite instalar como PWA |

## Instrucciones para publicar en GitHub Pages

1. Crear un repositorio en GitHub (puede ser privado o público)
2. Subir los 3 archivos al root del repositorio
3. Ir a **Settings → Pages → Source → Deploy from branch → main → / (root)**
4. En 1–2 minutos el juego estará disponible en `https://[usuario].github.io/[repo]/`

## Modo offline

La primera vez que se accede, el Service Worker cachea el HTML y las fuentes.  
A partir de entonces, el juego funciona **completamente sin conexión**.

El Service Worker también habilita la instalación como PWA (botón "Instalar" en Chrome/Edge).

## Creado por ProfeD.
