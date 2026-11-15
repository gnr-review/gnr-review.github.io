window.GNR_SITE = Object.freeze({
  fullSite: true,
  media: {
    film: {
      stem: 'assets/media/explainer',
      poster: 'assets/media/explainer-poster',
      duration: 189.267,
      steps: [
        { t: 76.4, clip: 'assets/media/method-data' },
        { t: 96.6, clip: 'assets/media/method-reference' },
        { t: 104.0, clip: 'assets/media/method-flow' },
        { t: 117.0, clip: 'assets/media/method-sample' },
        { t: 126.2, clip: 'assets/media/method-polish' },
      ],
      chapters: [
        [0, 'Opening'],
        [23, 'The retargeting problem'],
        [59, 'Learning feasible motion'],
        [73, 'How GNR works'],
        [133, 'Simulation results'],
        [161, 'Real robot policy'],
        [176, 'The takeaway'],
      ],
    },
  },
});
document.documentElement.dataset.siteMode = window.GNR_SITE.fullSite ? 'full' : 'preview';
