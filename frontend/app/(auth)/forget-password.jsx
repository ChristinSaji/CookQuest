import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  StatusBar,
  Dimensions,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackgroundSvg from "../../assets/svgs/bg-forget.svg";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { forgotPassword } from "../../utils/api";

export default function ForgotPasswordScreen() {
  const { width, height } = Dimensions.get("window");
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert("Missing Email", "Please enter your email.");
      return;
    }

    try {
      await forgotPassword(email);
      Alert.alert("Email Sent", "Check your email for the reset link.");
      router.push("/(auth)/reset-password");
    } catch (error) {
      Alert.alert("Error", error.message || "Something went wrong.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#A1B75A" />

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
        <Text className="text-white text-4xl font-semibold">
          Forgot Password?
        </Text>
        <Text className="text-white text-lg mt-2">
          Enter your email to reset your password
        </Text>
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
            placeholder="Enter your email"
            placeholderTextColor="gray"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <Pressable style={styles.sendButton} onPress={handleForgotPassword}>
          <Text style={styles.sendButtonText}>Send Reset Link</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
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
    top: "18%",
    left: 30,
    width: "80%",
  },
  inputContainer: {
    position: "absolute",
    bottom: 120,
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
  sendButton: {
    backgroundColor: "#A1B75A",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  sendButtonText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
});
