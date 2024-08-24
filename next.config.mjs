/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'xgames.co',
                port: '',
                pathname: '/randomusers/avatar.php'
            }
        ]
    }
};

export default nextConfig;
