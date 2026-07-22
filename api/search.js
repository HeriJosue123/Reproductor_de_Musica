// Función serverless de Vercel: busca canciones en YouTube sin exponer la API key.
// La clave vive en la variable de entorno YOUTUBE_API_KEY (Vercel > Settings > Environment Variables).
// El navegador llama a  /api/search?q=...  y este código habla con YouTube por detrás.

function decode(s) {
  return String(s || '')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

module.exports = async (req, res) => {
  const q = ((req.query && req.query.q) || '').toString().trim();

  if (!q) {
    res.status(200).json({ items: [] });
    return;
  }

  const key = process.env.YOUTUBE_API_KEY;
  if (!key) {
    res.status(500).json({ error: 'Falta YOUTUBE_API_KEY' });
    return;
  }

  const url = 'https://www.googleapis.com/youtube/v3/search'
    + '?part=snippet'
    + '&type=video'
    + '&videoEmbeddable=true'   // solo videos que se pueden reproducir incrustados
    + '&maxResults=15'
    + '&safeSearch=moderate'
    + '&q=' + encodeURIComponent(q)
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

    // Cachea 10 min en el borde de Vercel para gastar menos cuota
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=86400');
    res.status(200).json({ items });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
};
