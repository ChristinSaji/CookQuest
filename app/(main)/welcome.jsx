import {
  View,
  Text,
  Image,
  Pressable,
  ImageBackground,
  useWindowDimensions,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";

export default function WelcomeScreen() {
  const { width, height } = useWindowDimensions();

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.textContainer, { top: height * 0.2 }]}>
        <Text className="text-4xl text-gray-700 font-extrabold">Welcome</Text>
        <Text className="text-xl text-gray-500 text-center font-semibold px-10">
          Healthy meal plan made for you
        </Text>
      </View>

      <ImageBackground
        source={require("../../assets/images/bg-welcome.png")}
        style={[styles.backgroundImage, { width, height: height * 0.68 }]}
        resizeMode="cover"
      />

      <Image
        source={require("../../assets/images/salad.png")}
        style={[
          styles.saladImage,
          { width, height: height * 0.4, bottom: height * 0.12 },
        ]}
        resizeMode="contain"
      />

      <View style={[styles.buttonContainer, { bottom: height * 0.05 }]}>
        <Link href="/login">
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  textContainer: {
    position: "absolute",
    width: "100%",
    alignItems: "center",
  },
  backgroundImage: {
    position: "absolute",
    bottom: 0,
  },
  saladImage: {
    position: "absolute",
    alignSelf: "center",
  },
  buttonContainer: {
    position: "absolute",
    alignSelf: "center",
  },
});
