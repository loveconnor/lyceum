const loader = require.resolve("./honestui-icons-loader.cjs");

module.exports = {
  turbopack: {
    rules: {
      "**/node_modules/honestui/dist/icons.js": { loaders: [loader] },
    },
  },
  webpack(config) {
    config.module.rules.push({
      test: /[/\\]honestui[/\\]dist[/\\]icons\.js$/,
      use: loader,
    });
    return config;
  },
};
