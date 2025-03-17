import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  StatusBar,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackgroundSvg from "../../assets/svgs/bg-reset.svg";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function ResetPasswordScreen() {
  const { width, height } = Dimensions.get("window");
  const router = useRouter();

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
          Reset Password
        </Text>
        <Text className="text-white text-lg mt-2">
          Enter your new password below
        </Text>
      </View>

      <View style={styles.inputContainer}>
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
          />
        </View>

        <Pressable
          style={styles.resetButton}
          onPress={() => router.push("/(auth)/signin")}
        >
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
