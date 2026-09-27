module.exports = ({ config }) => ({
  ...config,
  experiments: {
    ...config.experiments,
    baseUrl: process.env.BASE_PATH ?? config.experiments?.baseUrl,
  },
});
