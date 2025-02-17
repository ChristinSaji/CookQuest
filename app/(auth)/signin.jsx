import {
  View,
  Text,
  TextInput,
  ImageBackground,
  Pressable,
  useWindowDimensions,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";
import { Link } from "expo-router";

export default function SignInScreen() {
  const { width, height } = useWindowDimensions();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor="#595959" />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <ImageBackground
              source={require("../../assets/images/bg-auth.png")}
              style={[styles.backgroundImage, { width, height }]}
              resizeMode="cover"
            >
              <Pressable
                onPress={() => router.back()}
                style={styles.backButton}
              >
                <Ionicons name="chevron-back" size={24} color="white" />
              </Pressable>

              <View style={[styles.textContainer, { top: height * 0.17 }]}>
                <Text className="text-white text-5xl font-semibold w-full px-8">
                  Welcome{"\n"}Back
                </Text>
              </View>

              <View style={[styles.textContainer, { top: height * 0.4 }]}>
                <Text className="text-white text-3xl font-semibold w-full px-8">
                  Sign in
                </Text>
              </View>

              <View style={[styles.inputContainer, { top: height * 0.46 }]}>
                <TextInput
                  placeholder="Your Email"
                  placeholderTextColor="white"
                  style={styles.input}
                />
                <TextInput
                  placeholder="Password"
                  placeholderTextColor="white"
                  secureTextEntry
                  style={styles.input}
                />

                <Pressable style={styles.submitButton}>
                  <FontAwesome6
                    name="circle-arrow-right"
                    size={50}
                    color="#A1B75A"
                  />
                </Pressable>
              </View>

              <View style={styles.bottomLinks}>
                <Link href="/(auth)/signup">
                  <Text className="text-white text-lg font-semibold">
                    Sign Up
                  </Text>
                </Link>
                <Link href="/(auth)/forgot-password">
                  <Text className="text-white text-lg">Forgot Password?</Text>
                </Link>
              </View>
            </ImageBackground>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#595959",
  },
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
  },
  textContainer: {
    position: "absolute",
    width: "100%",
    alignItems: "center",
  },
  inputContainer: {
    position: "absolute",
    width: "85%",
    alignSelf: "center",
  },
  input: {
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 12,
    fontSize: 18,
    color: "white",
    marginBottom: 14,
  },
  submitButton: {
    alignSelf: "flex-end",
    marginTop: 50,
    padding: 10,
  },
  bottomLinks: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 40,
  },
});
