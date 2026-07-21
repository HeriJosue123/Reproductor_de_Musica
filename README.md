# Reproductor de Música

Aplicación web de reproducción musical. Diseño móvil, tema oscuro con acento morado.

**Estado actual:** shell de interfaz completo con datos de demostración. Sin conexión a API todavía.

## Estructura

```
index.html    Aplicación completa (HTML + CSS + JS en un solo archivo)
```

## Ver la app

Abre `index.html` en cualquier navegador. No requiere servidor ni instalación.

Publicada con GitHub Pages en:
`https://herijosue123.github.io/Reproductor_de_Musica/`

## Pantallas

- **Inicio** — accesos rápidos, escuchado recientemente, mezclas
- **Buscar** — búsqueda en vivo, filtros por tipo, búsquedas recientes, tendencias
- **Biblioteca** — playlists guardadas
- **Perfil** — ajustes de cuenta y reproducción
- **Reproductor** — dos variantes: carátula cuadrada con cola de reproducción, y carátula circular con anillo de progreso, onda y panel de letra

El botón de los tres puntos en la esquina superior derecha del reproductor alterna entre las dos variantes.

## Pendiente

- [ ] Conectar YouTube Data API v3 para búsqueda y metadatos
- [ ] Integrar IFrame Player API para reproducción real
- [ ] Persistencia de playlists y favoritos en localStorage
- [ ] Definir función del botón central de la barra de navegación
- [ ] Reordenamiento por arrastre en la cola

## Notas técnicas

Las carátulas son degradados generados por CSS. En la versión conectada se reemplazan por las miniaturas que devuelve la API.

El panel de letra guarda texto ingresado manualmente. YouTube no expone letras por API y las fuentes que sí las tienen requieren licencia.
