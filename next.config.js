/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    instrumentationHook: false // Desabilita o trace
  },
  // Configurações adicionais
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3333',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '147.93.113.243',
        port: '5432',
        pathname: '/uploads/**',
      }
    ],
    unoptimized: true,
    domains: ['localhost'], // Adicione outros domínios conforme necessário
  },
  // Otimizações
  poweredByHeader: false,
  compress: true,
  // Configuração de ambiente
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL
  }
};

module.exports = nextConfig;