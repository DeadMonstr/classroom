export function getYouTubeThumbnail(url) {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.*|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg` : null;
}