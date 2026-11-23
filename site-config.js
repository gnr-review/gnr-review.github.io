window.GNR_SITE = Object.freeze({
  "fullSite": true,
  "media": {
    "film": {
      "label": "Explainer video",
      "version": "v4.3",
      "stem": "assets/media/explainer",
      "poster": "assets/media/explainer-poster",
      "duration": 236.1,
      "sizes": {
        "1080": "45 MB",
        "720": "24 MB"
      },
      "steps": [
        {
          "name": "1-engine",
          "t": 81.5,
          "end": 100.3,
          "clip": "assets/media/method-1-engine"
        },
        {
          "name": "2-reference",
          "t": 100.8,
          "end": 109.6,
          "clip": "assets/media/method-2-reference"
        },
        {
          "name": "3-flow",
          "t": 109.8,
          "end": 120.4,
          "clip": "assets/media/method-3-flow"
        },
        {
          "name": "4-sample",
          "t": 122.4,
          "end": 128.5,
          "clip": "assets/media/method-4-sample"
        },
        {
          "name": "5-warmstart",
          "t": 132.2,
          "end": 136.6,
          "clip": "assets/media/method-5-warmstart"
        }
      ],
      "chapters": [
        [
          0,
          "Opening"
        ],
        [
          26.5,
          "Why is this hard?"
        ],
        [
          65.9,
          "Why re-solve every demo?"
        ],
        [
          78.3,
          "How does GNR work?"
        ],
        [
          136.8,
          "Does it work?"
        ],
        [
          207.6,
          "From simulation to a real robot"
        ],
        [
          219.9,
          "The takeaway"
        ]
      ]
    }
  }
});
document.documentElement.dataset.siteMode = window.GNR_SITE.fullSite ? 'full' : 'preview';
