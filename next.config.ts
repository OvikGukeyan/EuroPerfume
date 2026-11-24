import { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  outputFileTracingIncludes: { "/*": ["./public/fonts/DejaVuSans.ttf", "./public/fonts/DejaVuSans-Bold.ttf", "./public/assets/logo.png"] },
  serverExternalPackages: ["pdfkit"],
  reactStrictMode: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.xerjoff.com", pathname: "/cdn/shop/files/**" },
      { protocol: "https", hostname: "parfums-de-marly.com", pathname: "/cdn/shop/files/**" },
    ],
    domains: ["tlppllvnvzjgxgbzlwnh.supabase.co", 'thgjecpmxhqwfoknvjiu.supabase.co'],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb', 
    },
  },

};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
