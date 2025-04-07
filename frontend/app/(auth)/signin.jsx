import React, { useState } from "react";
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
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackgroundSvg from "../../assets/svgs/bg-signin.svg";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { loginUser } from "../../utils/api";

export default function SignInScreen() {
  const { width, height } = Dimensions.get("window");
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    try {
      const data = await loginUser({ email, password });
      console.log("Login success:", data);

      router.push("/(main)/(tabs)/recipes");
    } catch (error) {
      console.error("Login error:", error.message);
      Alert.alert("Login Failed", error.message);
    }
  };

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
            <Text style={styles.welcomeText}>Welcome{"\n"}Back</Text>
          </View>

          <View style={styles.inputContainer}>
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
                value={email}
                onChangeText={setEmail}
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
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <Pressable
              style={styles.forgotContainer}
              onPress={() => router.push("/(auth)/forget-password")}
            >
              <Text style={styles.forgotText}>Forgot password?</Text>
            </Pressable>

            <Pressable style={styles.signInButton} onPress={handleSignIn}>
              <Text style={styles.signInText}>Sign In</Text>
            </Pressable>

            <View style={styles.orContainer}>
              <View style={styles.line} />
              <Text style={styles.orText}>or</Text>
              <View style={styles.line} />
            </View>

            <Pressable
              style={styles.signUpButton}
              onPress={() => router.push("/(auth)/signup")}
            >
              <Text style={styles.signUpText}>Sign up</Text>
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
    marginTop: "80%",
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
  forgotContainer: {
    alignSelf: "flex-end",
    marginBottom: 14,
  },
  forgotText: {
    fontSize: 14,
    color: "#A1B75A",
  },
  signInButton: {
    backgroundColor: "#A1B75A",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 5,
  },
  signInText: {
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
  signUpButton: {
    borderWidth: 1,
    borderColor: "#A1B75A",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  signUpText: {
    fontSize: 18,
    color: "#A1B75A",
  },
});
