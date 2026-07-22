// Función serverless de Vercel: busca éxitos musicales en YouTube para la pantalla de inicio.
// La clave vive en la variable de entorno YOUTUBE_API_KEY (Vercel > Settings > Environment Variables).
// El navegador llama a  /api/home  y este código habla con YouTube por detrás.

function decode(s) {
  return String(s || '')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

module.exports = async (req, res) => {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) {
    res.status(500).json({ error: 'Falta YOUTUBE_API_KEY' });
    return;
  }

  // Búsqueda genérica de éxitos musicales para que siempre haya contenido
  const query = 'exitos reggaeton 2024';

  const url = 'https://www.googleapis.com/youtube/v3/search'
    + '?part=snippet'
    + '&type=video'
    + '&videoEmbeddable=true'   // Solo videos que se pueden incrustar
    + '&videoCategoryId=10'     // Categoría Música
    + '&maxResults=15'          // Suficientes para llenar la pantalla de inicio
    + '&safeSearch=moderate'
    + '&q=' + encodeURIComponent(query)
    + '&key=' + key;

  try {
    const r = await fetch(url);
    const data = await r.json();

    if (data.error) {
      const msg = (data.error.errors && data.error.errors[0] && data.error.errors[0].reason) || data.error.message;
      res.status(500).json({ error: msg });
      return;
    }

    const items = (data.items || [])
      .filter(it => it.id && it.id.videoId)
      .map(it => ({
        yt: it.id.videoId,
        title: decode(it.snippet.title),
        artist: decode(it.snippet.channelTitle),
        thumb: (it.snippet.thumbnails && it.snippet.thumbnails.medium && it.snippet.thumbnails.medium.url) || ''
      }));

    // Cachea 1 HORA (3600s) en Vercel Edge para que cada vez que se abra la app
    // no se gaste cuota de YouTube, todos los usuarios recibirán la misma respuesta en esa hora.
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    res.status(200).json({ items });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
};
