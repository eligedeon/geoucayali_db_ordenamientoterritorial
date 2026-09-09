# GeoUcayali - Ordenamiento Territorial

Dashboard estático preparado para GitHub Pages y para incrustarse en ArcGIS Experience Builder.

## Contenido cargado
El catálogo se generó a partir de la hoja:
**Catálogo de Datos - Ordenamiento Territorial - GeoUcayali**

Incluye:
- Marco Normativo
- ZEE
- Submodelos
- Estudios temáticos: Físico, Biológico, Sociocultural y Socioeconómico
- Mapas temáticos en PDF/JPG
- Visor documental de mapas mediante Google Drive Preview

## Archivos
- index.html
- styles.css
- app.js
- data.js

## Publicación
Sube los archivos a la raíz de un repositorio GitHub y activa:
Settings > Pages > Deploy from a branch > main > /(root)

## Migración futura al servidor GOREU
Cuando los archivos sean migrados desde Google Drive al servidor institucional,
solo será necesario reemplazar `viewUrl`, `previewUrl` y `downloadUrl` en `data.js`.
