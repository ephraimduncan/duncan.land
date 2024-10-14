const { withContentlayer } = require("next-contentlayer");

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        remotePatterns: [ {
            protocol: 'https',
            hostname: 'cdn.discordapp.com',
            pathname: '**',
        }
        ],
    },
};

module.exports = withContentlayer(nextConfig);
