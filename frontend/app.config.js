import "dotenv/config";

export default {
  expo: {
    name: "CookQuest",
    slug: "cookquest",
    version: "1.0.0",
    orientation: "portrait",
    scheme: "cookquest",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      permissions: [
        "android.permission.CAMERA",
        "android.permission.RECORD_AUDIO",
      ],
      package: "com.christinsaji.cookquest",
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
      [
        "expo-camera",
        {
          cameraPermission: "Allow CookQuest to access your camera",
          microphonePermission: "Allow CookQuest to access your microphone",
          recordAudioAndroid: true,
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      BASE_URL: process.env.BASE_URL,
      BASE_IMAGE_URL: process.env.BASE_IMAGE_URL,
      eas: {
        projectId: "33769708-579d-4bc4-ab7d-d089fcb713f3",
      },
      router: {
        origin: false,
      },
    },
  },
};
