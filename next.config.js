const { withContentlayer } = require("next-contentlayer");

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    async rewrites() {
        return [
            {
                source: "/talks/:slug",
                destination: "/static/talks/:slug/index.html",
            },
            {
                source: "/talks/assets/:path*",
                destination: "/static/talks/cityjs-lagos-2023/assets/:path*",
                // This isnt stabe, I cant add a different talk slide because it will link to the same path as CityJS Lagos 2023
            },
        ];
    },
};

module.exports = withContentlayer(nextConfig);
