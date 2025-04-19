import {
  View,
  Text,
  Pressable,
  StyleSheet,
  StatusBar,
  Image,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import BackgroundSvg from "../../assets/svgs/bg-completion.svg";
import BasketImage from "../../assets/images/vegetable-basket.png";

const { width, height } = Dimensions.get("window");

export default function CompletionScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#A1B75A" />

      <View style={styles.svgContainer}>
        <BackgroundSvg
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid slice"
        />
      </View>

      <Image
        source={BasketImage}
        style={styles.basketImage}
        resizeMode="contain"
      />

      <View style={styles.textContainer}>
        <Text style={styles.title}>Awesome!!</Text>
        <Text style={styles.subText}>
          You earned 50 Points for cooking this meal
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable
          style={styles.primaryButton}
          onPress={() => router.push("/(main)/review")}
        >
          <Text style={styles.buttonText}>Share your thoughts</Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={() => router.push("/(main)/(tabs)/recipes")}
        >
          <Text style={styles.buttonText}>Go Home</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    overflow: "visible",
  },
  svgContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "100%",
  },
  basketImage: {
    width: width * 1.2,
    height: height * 1,
    position: "absolute",
    top: -height * 0.2,
    right: -width * 0.3,
    zIndex: 2,
  },
  textContainer: {
    marginTop: height * 0.6,
    alignItems: "center",
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "black",
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    color: "#444",
    textAlign: "center",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    paddingHorizontal: 40,
  },
  primaryButton: {
    backgroundColor: "#A1B75A",
    paddingVertical: 15,
    borderRadius: 30,
    marginBottom: 15,
    alignItems: "center",
  },
  secondaryButton: {
    backgroundColor: "#A1B75A",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
});
