/** @type {import('next').NextConfig} */
const createNextIntlPlugin = require('next-intl/plugin');
 
const withNextIntl = createNextIntlPlugin();


const nextConfig = {
  webpack: (config) => {
        config.externals = [...config.externals, 'bcrypt'];
        return config;
     },
    async redirects() {
        return [
          {
            source: '/',
            destination: '/dashboard',
            permanent: true,
          },
        
        ];
      },
    images: {
        remotePatterns: [
            {
              protocol: "https",
              hostname: 'res.cloudinary.com', 
            },
            {
              protocol: "https",
              hostname: 'lh3.googleusercontent.com', 
            },

        ]
    }
}


module.exports = withNextIntl(nextConfig);
