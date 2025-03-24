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
import BackgroundSvg from "../../assets/svgs/bg-reset.svg";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { resetPassword } from "../../utils/api";

export default function ResetPasswordScreen() {
  const { width, height } = Dimensions.get("window");
  const router = useRouter();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState(""); // Paste token from email

  const handleReset = async () => {
    if (!newPassword || !confirmPassword || !token) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    try {
      const response = await resetPassword(token, newPassword);
      Alert.alert("Success", "Password reset successful!", [
        { text: "OK", onPress: () => router.push("/(auth)/signin") },
      ]);
    } catch (err) {
      console.error(err);
      Alert.alert("Reset Failed", err.message);
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
        <Text style={{ color: "white", fontSize: 36, fontWeight: "bold" }}>
          Reset Password
        </Text>
        <Text style={{ color: "white", fontSize: 16, marginTop: 6 }}>
          Enter your new password below
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <Ionicons
            name="key-outline"
            size={20}
            color="gray"
            style={styles.icon}
          />
          <TextInput
            placeholder="Reset Token"
            placeholderTextColor="gray"
            style={styles.input}
            value={token}
            onChangeText={setToken}
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
            placeholder="New Password"
            placeholderTextColor="gray"
            style={styles.input}
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
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
            placeholder="Confirm Password"
            placeholderTextColor="gray"
            style={styles.input}
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        <Pressable style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetButtonText}>Reset Password</Text>
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
  resetButton: {
    backgroundColor: "#A1B75A",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  resetButtonText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
});
