import { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['media.dodostatic.net', 'cdn.dodostatic.net', 'cdn.inappstory.ru', "media.douglas.de", "tlppllvnvzjgxgbzlwnh.supabase.co", 'thgjecpmxhqwfoknvjiu.supabase.co'],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb', 
    },
  },

};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);