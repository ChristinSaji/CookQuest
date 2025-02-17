import {
  View,
  Text,
  Image,
  Pressable,
  ImageBackground,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";

export default function WelcomeScreen() {
  const { width, height } = useWindowDimensions();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View
        style={{
          position: "absolute",
          top: height * 0.2,
          width: "100%",
          alignItems: "center",
        }}
      >
        <Text className="text-4xl text-gray-700 font-extrabold">Welcome</Text>
        <Text className="text-xl text-gray-500 text-center font-semibold px-10">
          Healthy meal plan made for you
        </Text>
      </View>

      <ImageBackground
        source={require("../../assets/images/bg-welcome.png")}
        style={{
          position: "absolute",
          bottom: 0,
          width: width,
          height: height * 0.68,
        }}
        resizeMode="cover"
      />

      <Image
        source={require("../../assets/images/salad.png")}
        style={{
          width: width,
          height: height * 0.4,
          position: "absolute",
          bottom: height * 0.12,
          alignSelf: "center",
        }}
        resizeMode="contain"
      />

      <View
        style={{
          position: "absolute",
          bottom: height * 0.05,
          alignSelf: "center",
        }}
      >
        <Link href="/login" asChild>
          <Pressable className="bg-white px-10 py-3 rounded-lg">
            <Text className="text-gray-600 text-center font-semibold">
              GET STARTED
            </Text>
          </Pressable>
        </Link>
      </View>
    </SafeAreaView>
  );
}
