# Reproductor de Música

Aplicación web de reproducción musical. Diseño móvil, tema oscuro con acento morado.

**Estado actual:** interfaz completa con audio real de prueba. Cada canción de demostración
reproduce su video de YouTube mediante la IFrame Player API (solo audio, reproductor oculto).

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

## Búsqueda en vivo (YouTube Data API v3)

La pantalla de Buscar consulta YouTube en tiempo real a través de una función
serverless (`api/search.js`), para que la API key nunca quede expuesta en el
código público.

Para activarla:

1. Crea una API key en [Google Cloud Console](https://console.cloud.google.com):
   habilita **YouTube Data API v3** y genera una **Clave de API**.
2. En Vercel → **Settings → Environment Variables** añade
   `YOUTUBE_API_KEY` con el valor de tu clave.
3. Vuelve a desplegar (**Redeploy**).

Sin la variable configurada, la app sigue funcionando con la biblioteca de
demostración; la sección "En YouTube" solo avisa que falta la key.

## Pendiente

- [x] Integrar IFrame Player API para reproducción real (audio de prueba con IDs fijos)
- [x] Conectar YouTube Data API v3 para búsqueda en vivo (requiere `YOUTUBE_API_KEY`)
- [ ] Persistencia de playlists y favoritos en localStorage
- [ ] Definir función del botón central de la barra de navegación
- [ ] Reordenamiento por arrastre en la cola

## Notas técnicas

Las carátulas son degradados generados por CSS. En la versión conectada se reemplazan por las miniaturas que devuelve la API.

El panel de letra guarda texto ingresado manualmente. YouTube no expone letras por API y las fuentes que sí las tienen requieren licencia.
