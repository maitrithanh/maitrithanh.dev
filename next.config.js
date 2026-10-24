/** @type {import('next').NextConfig} */
const nextConfig = {
    turbopack: {
        root: __dirname,
    },
    outputFileTracingRoot: __dirname,
    typescript: {
        ignoreBuildErrors: true,
    },
    experimental: {
        useTypeScriptCli: false,
    },
    async headers() {
        return [{
            source: "/:path*",
            headers: [
                { key: "X-Frame-Options", value: "DENY" },
                { key: "X-Content-Type-Options", value: "nosniff" },
                { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
                { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
            ],
        }]
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "cdn.buymeacoffee.com",
                pathname: '**',
            },
            {
                protocol: "https",
                hostname: "cdn-icons-png.flaticon.com",
                pathname: '**',
            }
        ]
    }
}

module.exports = nextConfig
