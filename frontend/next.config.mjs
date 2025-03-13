/** @type {import('next').NextConfig} */

const nextConfig = {
  webpack: (config) => {
    // config.module.rules.push({
    //   test: /\.css$/, // Target CSS files
    //   include: [
    //     /node_modules\/react-datepicker/, // Include react-datepicker styles
    //     /node_modules\/swiper/, // Include swiper styles
    //   ],
    //   use: [
    //     "style-loader", // Inject styles into the DOM
    //     "css-loader", // Resolve @import and url() in CSS
    //     "postcss-loader", // Optional but useful for advanced CSS features
    //   ],
    // });

    config.module.rules.push({
      test: /\.pdf$/, // Match .pdf files
      type: "asset/resource", // Handle PDFs as static assets
    });

    config.module.rules.push({
      test: /\.(mp4|webm|ogg|avi|mkv)$/, // Match video formats
      type: "asset/resource", // Handle videos as static assets
    });

    return config;
  },
  images: {
    // domains: ["38.60.163.86"], // Add the IP address as a domain
    domains: ["localhost", "89.111.141.133"],
    // domains: ["localhost"], // Add the IP address as a domain1
    remotePatterns: [
      {
        protocol: "http",
        hostname: "89.111.141.133",
        // hostname: "localhost",
        port: "8000",
        // hostname: "bandback-production.up.railway.app",
        pathname: "/storage/uploads/**",
      },
      {
        protocol: "http",
        hostname: "localhost", // Localhost configuration
        port: "8000", // Port for local development
        pathname: "/storage/uploads/**", // Pattern for image paths
      },
    ],
  },
};

export default nextConfig;
