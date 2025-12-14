# Hosting rewrite rules for SPA (React + Vite)

This project uses `BrowserRouter` (clean URLs). Static hosts must return `index.html` for unknown paths so the client-side router can take over.

Add one of these to your deployment to avoid 404s on refresh/direct links:

- Netlify
  - Add `public/_redirects` with this content (already added):
    ```text
    /*    /index.html   200
    ```
  - Netlify will copy `public/_redirects` into the published site.

- Vercel
  - `vercel.json` at project root (already added):
    ```json
    {
      "routes": [
        { "src": "/(.*)", "dest": "/index.html" }
      ]
    }
    ```

- GitHub Pages
  - Add a `404.html` that loads the SPA index (already added at `public/404.html`). GitHub Pages serves `404.html` for unknown paths.

- Nginx
  - Use this `location` snippet in your server block:
    ```nginx
    location / {
      try_files $uri $uri/ /index.html;
    }
    ```

- S3 + CloudFront
  - Configure the S3 bucket to serve `index.html` as the error document, or set CloudFront behavior to return `index.html` for 403/404 responses. Use Lambda@Edge for more complex rewrites.

Notes
- Vite copies anything in `public/` into the build output, so `public/_redirects` and `public/404.html` will be available in the deployed `dist/` folder.
- These rewrites only address 404s on refresh/direct links. They do NOT affect API or database permission issues (Supabase RLS or table names).

If you tell me where you host (Netlify, Vercel, GitHub Pages, S3+CloudFront, DigitalOcean App Platform, etc.), I can give exact deployment steps.
