/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  webpack(config) {
    // h/t https://github.com/securingsincity/react-ace/issues/725#issuecomment-1407356137
    config.module.rules.push({
      test: /ace-builds.*\/worker-.*$/,
      type: "asset/resource",
    });
    return config;
  },
};

module.exports = nextConfig;
