import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  StatusBar,
  Dimensions,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackgroundSvg from "../../assets/svgs/bg-signup.svg";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function SignUpScreen() {
  const { width, height } = Dimensions.get("window");
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#A1B75A" />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.backgroundContainer, { width, height }]}>
            <BackgroundSvg
              width="100%"
              height="100%"
              preserveAspectRatio="xMidYMid slice"
            />
          </View>

          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color="white" />
          </Pressable>

          <View style={styles.textContainer}>
            <Text style={styles.welcomeText}>Create{"\n"}Account</Text>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="person-outline"
                size={20}
                color="gray"
                style={styles.icon}
              />
              <TextInput
                placeholder="Name"
                placeholderTextColor="gray"
                style={styles.input}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Ionicons
                name="mail-outline"
                size={20}
                color="gray"
                style={styles.icon}
              />
              <TextInput
                placeholder="Email"
                placeholderTextColor="gray"
                style={styles.input}
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputWrapper}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="gray"
                style={styles.icon}
              />
              <TextInput
                placeholder="Password"
                placeholderTextColor="gray"
                style={styles.input}
                secureTextEntry
              />
            </View>

            <Pressable style={styles.signUpButton}>
              <Text style={styles.signUpText}>Sign Up</Text>
            </Pressable>

            <View style={styles.orContainer}>
              <View style={styles.line} />
              <Text style={styles.orText}>or</Text>
              <View style={styles.line} />
            </View>

            <Pressable
              style={styles.signInButton}
              onPress={() => router.push("/(auth)/signin")}
            >
              <Text style={styles.signInText}>Sign In</Text>
            </Pressable>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  backgroundContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "50%",
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 10,
    zIndex: 10,
    padding: 10,
  },
  textContainer: {
    position: "absolute",
    top: "15%",
    left: 30,
  },
  welcomeText: {
    color: "white",
    fontSize: 42,
    fontWeight: "bold",
  },
  inputContainer: {
    marginTop: "75%",
    width: "85%",
    alignSelf: "center",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 12,
    borderBottomWidth: 2,
    borderColor: "lightgray",
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "black",
  },
  signUpButton: {
    backgroundColor: "#A1B75A",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 5,
  },
  signUpText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 12,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "lightgray",
    marginHorizontal: 10,
  },
  orText: {
    fontSize: 14,
    color: "gray",
  },
  signInButton: {
    borderWidth: 1,
    borderColor: "#A1B75A",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  signInText: {
    fontSize: 18,
    color: "#A1B75A",
  },
});
