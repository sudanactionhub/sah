export default async function handler(req, res) {
  const baseUrl = "https://www.sudanactionhub.org";

  // Example: fetch blog posts
  const posts = await fetch("https://sudanactionhub.org/blog")
    .then(res => res.json());

  const staticPages = ["", "news", "research", "organization-directory", "organization-directory/data", "evidence-collection", "advocacy", "events", "events/:id", "event-programming", "humanitarian", "diaspora", "gala", "donations", "donate", "contact", "about", "joinus", "privacypolicy", "blog"];


  const urls = [
    ...staticPages.map(path => ({
      loc: `${baseUrl}${path}`,
      priority: path === "" ? "1.0" : "0.7"
    })),

    ...posts.map(post => ({
      loc: `${baseUrl}/blog/${post.slug}`,
      priority: "0.6",
      lastmod: post.updated_at
    }))
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls.map(url => `
      <url>
        <loc>${url.loc}</loc>
        <lastmod>${url.lastmod || new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>${url.priority}</priority>
      </url>
    `).join("")}
  </urlset>`;

  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();
};