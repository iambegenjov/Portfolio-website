/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // PREVIEW_EXPORT=1 builds a static copy (out/) for the claude.ai preview; Vercel uses the normal build.
  ...(process.env.PREVIEW_EXPORT
    ? { output: 'export', trailingSlash: true, images: { unoptimized: true }, env: { NEXT_PUBLIC_PREVIEW: '1' } }
    : {
        // The admin panel is a plain page in public/admin/
        async rewrites() {
          return [{ source: '/admin', destination: '/admin/index.html' }];
        },
      }),
};

export default nextConfig;
