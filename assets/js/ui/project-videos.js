const videos = document.querySelectorAll('.masonry video');

if (videos.length && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const video = entry.target;
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      }
    },
    { rootMargin: '120px 0px', threshold: 0.2 }
  );

  videos.forEach((video) => {
    video.preload = 'none';
    io.observe(video);
  });
} else {
  videos.forEach((video) => {
    video.preload = 'none';
    video.play().catch(() => {});
  });
}
