# Anonymous review site

Static website. Serve this directory as the site root; no build or third-party service is required.

```sh
python3 -m http.server 8080 --bind 127.0.0.1
```

The first content section presents a synchronized four-camera physical rollout. The main explainer, method excerpts, simulation demonstrations, and figures are served from local assets. Video hosting should support byte-range requests for seeking.

After changing site assets, run `python3 scripts/stamp_assets.py` to refresh the cache keys.
