const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

module.exports = withNativeWind(
  (() => {
    const config = getDefaultConfig(__dirname);

    config.transformer = config.transformer || {};
    config.resolver = config.resolver || {};

    config.transformer.babelTransformerPath = require.resolve(
      "react-native-svg-transformer"
    );
    config.resolver.assetExts = config.resolver.assetExts.filter(
      (ext) => ext !== "svg"
    );
    config.resolver.sourceExts = [...config.resolver.sourceExts, "svg"];

    return config;
  })(),
  { input: "./global.css" }
);
