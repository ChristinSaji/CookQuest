import { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Camera } from "expo-camera";
import { getMealSteps, getRecipeById } from "../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

export default function CookingScreen() {
  const router = useRouter();
  const { stepIndex, mealId } = useLocalSearchParams();

  const [steps, setSteps] = useState([]);
  const [mealName, setMealName] = useState("");
  const [currentStep, setCurrentStep] = useState(parseInt(stepIndex || "0"));
  const [hasPermission, setHasPermission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const fetchedSteps = await getMealSteps(mealId);
        const meal = await getRecipeById(mealId);
        setMealName(meal.name);

        const stepObjects = fetchedSteps.map((text, index) => ({
          id: index + 1,
          text,
          image: require("../../assets/images/cooking-step.png"),
        }));
        setSteps(stepObjects);

        if (parseInt(stepIndex) === 0) {
          await AsyncStorage.setItem(
            "cooking_start_time",
            Date.now().toString()
          );
        }
      } catch (error) {
        alert("Failed to load steps or meal info.");
      } finally {
        setLoading(false);
      }
    })();
  }, [mealId]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const startTimeStr = await AsyncStorage.getItem("cooking_start_time");
      if (startTimeStr) {
        const startTime = parseInt(startTimeStr);
        const now = Date.now();
        const diff = Math.floor((now - startTime) / 1000);
        setElapsedTime(diff);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (steps.length && currentStep >= steps.length) {
      router.replace({
        pathname: "/(main)/completion",
        params: { mealId, elapsedTime: elapsedTime.toString() },
      });
    }
  }, [steps, currentStep]);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const openCamera = () => {
    if (hasPermission) {
      router.push(`/camera?stepIndex=${currentStep}&mealId=${mealId}`);
    } else {
      alert("Camera permission not granted");
    }
  };

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds}s`;
  };

  if (loading || !steps.length) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#A1B75A" />
      </SafeAreaView>
    );
  }

  const step = steps[currentStep];
  if (!step) return null;

  return (
    <SafeAreaView style={styles.container}>
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="chevron-back" size={28} color="black" />
      </Pressable>

      <Text style={styles.mealTitle}>{mealName}</Text>
      <Text style={styles.timerText}>⏱ {formatTime(elapsedTime)}</Text>

      <View style={styles.stepBox}>
        <Ionicons name="time-outline" size={18} color="#7D9A55" />
        <Text style={styles.stepText}>
          Step {currentStep + 1} of {steps.length}
        </Text>
      </View>

      <Image source={step.image} style={styles.image} resizeMode="contain" />
      <Text style={styles.description}>{step.text}</Text>

      <Pressable style={styles.cameraButton} onPress={openCamera}>
        <Ionicons name="camera-outline" size={26} color="white" />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
    padding: 10,
  },
  mealTitle: {
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 60,
    color: "black",
  },
  timerText: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: "500",
    color: "#555",
  },
  stepBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E0E0E0",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginTop: 10,
  },
  stepText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#333",
  },
  image: {
    width: width * 0.7,
    height: height * 0.35,
    marginTop: 70,
  },
  description: {
    textAlign: "center",
    fontSize: 16,
    color: "#222",
    marginTop: 30,
    paddingHorizontal: 10,
  },
  cameraButton: {
    marginTop: 40,
    backgroundColor: "#A1B75A",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
});
