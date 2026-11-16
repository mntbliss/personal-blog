const marquee = document.querySelector('.collab-marquee');
const track = document.querySelector('.collab-track');
const firstSet = document.querySelector('.collab-track .collab-set');

if (marquee && track && firstSet) {
  const SPEED_PX_PER_SEC = 42;

  function clearClones() {
    track.querySelectorAll('.collab-set[data-clone="true"]').forEach((node) => node.remove());
  }

  function setup() {
    clearClones();
    track.style.animation = 'none';
    track.style.transform = 'translateX(0)';

    const baseWidth = firstSet.getBoundingClientRect().width;
    if (!baseWidth) return;

    const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 0;
    const segment = baseWidth + gap;
    const needed = Math.max(2, Math.ceil((marquee.clientWidth * 2) / segment) + 1);

    for (let i = 1; i < needed; i += 1) {
      const clone = firstSet.cloneNode(true);
      clone.dataset.clone = 'true';
      clone.setAttribute('aria-hidden', 'true');
      clone.querySelectorAll('[alt]').forEach((el) => el.setAttribute('alt', ''));
      track.appendChild(clone);
    }

    const duration = segment / SPEED_PX_PER_SEC;
    track.style.setProperty('--marquee-shift', `${segment}px`);
    track.style.setProperty('--marquee-duration', `${duration}s`);
    void track.offsetWidth;
    track.style.animation = '';
  }

  function whenImagesReady() {
    const images = [...firstSet.querySelectorAll('img')];
    return Promise.all(
      images.map((img) =>
        img.complete
          ? Promise.resolve()
          : new Promise((resolve) => {
              img.addEventListener('load', resolve, { once: true });
              img.addEventListener('error', resolve, { once: true });
            })
      )
    );
  }

  whenImagesReady().then(setup);
  window.addEventListener('resize', setup);
}
