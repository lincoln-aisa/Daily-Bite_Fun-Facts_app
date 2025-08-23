module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Expo Router plugin (required)
      'expo-router/babel',
      // Dotenv plugin (keep this for your @env imports)
      ['module:react-native-dotenv', {
        moduleName: '@env',
        path: '.env',
        safe: false,
        allowUndefined: true,
      }]
    ],
  };
};
