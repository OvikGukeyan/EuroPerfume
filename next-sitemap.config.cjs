/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.euro-perfume.com', // 🔹 замени на свой домен
  generateRobotsTxt: true,        // создаёт robots.txt автоматически
  sitemapSize: 7000,
  exclude: ['/*/supplier-import', '/supplier-import'],
  changefreq: 'weekly',
  priority: 0.7,
};
