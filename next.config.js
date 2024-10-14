const { withContentlayer } = require("next-contentlayer");

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        domains: ['cdn.discordapp.com'],
    },
};

module.exports = withContentlayer(nextConfig);
