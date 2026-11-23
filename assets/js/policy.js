(() => {
  'use strict';

  const root = document.querySelector('[data-policy]');
  if (!root) return;
  const deck = root.querySelector('[data-policy-deck]');
  const grid = root.querySelector('[data-policy-grid]');
  const toggle = root.querySelector('[data-policy-play]');
  const seek = root.querySelector('[data-policy-seek]');
  const clock = root.querySelector('[data-policy-time]');
  const full = root.querySelector('[data-policy-full]');
  const error = root.querySelector('[data-policy-error]');
  const asset = (path) => {
    const hash = (window.GNR_ASSET_V || {})[path];
    return hash ? path + '?v=' + hash : path;
  };

  const video = document.createElement('video');
  video.muted = true;
  video.playsInline = true;
  video.preload = 'none';
  video.setAttribute('aria-hidden', 'true');
  video.className = 'policy__source';
  deck.append(video);

  const views = [
    {id: 'top', label: 'Top view', source: [0, 0, 640, 304]},
    {id: 'side', label: 'Side view', source: [640, 0, 640, 304]},
    {id: 'wrist-1', label: 'Wrist view 1', source: [80, 304, 480, 304]},
    {id: 'wrist-2', label: 'Wrist view 2', source: [720, 304, 480, 304]},
  ];

  views.forEach((view, index) => {
    view.button = document.createElement('button');
    view.button.type = 'button';
    view.button.className = 'policy__camera';
    view.button.dataset.view = view.id;
    view.button.setAttribute('aria-label', 'Show ' + view.label + ' in the main panel');
    view.button.setAttribute('aria-pressed', String(index === 0));
    const poster = document.createElement('img');
    poster.alt = '';
    poster.loading = 'lazy';
    poster.decoding = 'async';
    poster.src = asset('assets/policy/' + view.id + '.jpg');
    const canvas = document.createElement('canvas');
    canvas.width = view.source[2];
    canvas.height = view.source[3];
    canvas.setAttribute('aria-hidden', 'true');
    view.context = canvas.getContext('2d', { alpha: false });
    const label = document.createElement('span');
    label.className = 'policy__label';
    label.textContent = view.label;
    view.button.append(poster, canvas, label);
    grid.append(view.button);
    view.button.addEventListener('click', () => {
      const first = grid.firstElementChild;
      if (first === view.button) return;
      view.button.replaceWith(first);
      grid.prepend(view.button);
      first.setAttribute('aria-pressed', 'false');
      view.button.setAttribute('aria-pressed', 'true');
      view.button.focus({preventScroll: true});
    });
  });

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const format = (seconds) => Math.floor(seconds / 60) + ':' + String(Math.floor(seconds % 60)).padStart(2, '0');
  const update = () => {
    const duration = video.duration;
    const current = video.currentTime || 0;
    if (!Number.isFinite(duration)) return;
    seek.max = duration;
    if (document.activeElement !== seek) seek.value = current;
    seek.setAttribute('aria-valuetext', format(current) + ' of ' + format(Math.ceil(duration)));
    clock.textContent = format(current) + ' / ' + format(Math.ceil(duration));
  };
  const draw = () => {
    if (video.readyState < 2) return;
    for (const {source, context} of views) {
      if (!context) continue;
      context.drawImage(video, ...source, 0, 0, source[2], source[3]);
    }
    deck.classList.add('is-drawn');
  };
  let frame = null;
  const supportsVideoFrame = typeof video.requestVideoFrameCallback === 'function';
  const cancelFrame = () => {
    if (frame === null) return;
    if (supportsVideoFrame) video.cancelVideoFrameCallback(frame);
    else cancelAnimationFrame(frame);
    frame = null;
  };
  const paint = () => {
    frame = null;
    draw();
    if (!video.paused && !video.ended) requestFrame();
  };
  function requestFrame() {
    if (frame !== null) return;
    frame = supportsVideoFrame ? video.requestVideoFrameCallback(paint) : requestAnimationFrame(paint);
  }

  let manuallyPaused = false;
  let visible = false;
  const start = async (manual) => {
    error.hidden = true;
    if (!video.getAttribute('src') || video.error) {
      video.src = asset('assets/policy/shape-insertion.mp4');
      video.load();
    }
    if (video.ended) video.currentTime = 0;
    try { await video.play(); }
    catch (failure) {
      if (manual && failure.name !== 'AbortError') error.hidden = false;
    }
  };
  toggle.addEventListener('click', () => {
    if (video.paused || video.ended) { manuallyPaused = false; start(true); }
    else { manuallyPaused = true; video.pause(); }
  });
  seek.addEventListener('input', () => { video.currentTime = Number(seek.value); update(); });
  seek.addEventListener('blur', update);
  video.addEventListener('loadeddata', draw);
  video.addEventListener('seeked', draw);
  video.addEventListener('loadedmetadata', () => { seek.disabled = false; update(); });
  video.addEventListener('timeupdate', update);
  video.addEventListener('playing', () => { toggle.textContent = 'Pause'; requestFrame(); });
  video.addEventListener('pause', () => {
    cancelFrame();
    if (!video.ended) toggle.textContent = 'Play';
  });
  video.addEventListener('ended', () => {
    manuallyPaused = true;
    toggle.textContent = 'Replay';
    draw();
    update();
  });
  video.addEventListener('error', () => { error.hidden = false; seek.disabled = true; });
  const visibility = () => {
    if (!visible || document.hidden || reduced.matches) video.pause();
    else if (!manuallyPaused && !(navigator.connection && navigator.connection.saveData)) start(false);
  };
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio >= 0.33;
      visibility();
    }, {threshold: 0.33}).observe(grid);
  }
  document.addEventListener('visibilitychange', visibility);
  reduced.addEventListener('change', visibility);

  if (document.fullscreenEnabled && deck.requestFullscreen) {
    full.hidden = false;
    full.addEventListener('click', () => {
      const action = document.fullscreenElement === deck ? document.exitFullscreen() : deck.requestFullscreen();
      action.catch(() => {});
    });
    document.addEventListener('fullscreenchange', () => {
      full.textContent = document.fullscreenElement === deck ? 'Exit full screen' : 'Full screen';
    });
  }
})();
