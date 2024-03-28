/** @type {import('next').NextConfig} */
const nextConfig = {
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


module.exports = nextConfig
