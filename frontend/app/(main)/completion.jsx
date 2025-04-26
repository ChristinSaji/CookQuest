import {
  View,
  Text,
  Pressable,
  StyleSheet,
  StatusBar,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

import BackgroundSvg from "../../assets/svgs/bg-completion.svg";
import BasketImage from "../../assets/images/vegetable-basket.png";
import { getCompletionSummary } from "../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

export default function CompletionScreen() {
  const router = useRouter();
  const { mealId, elapsedTime } = useLocalSearchParams();
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    async function fetchSummary() {
      try {
        const startTimeStr = await AsyncStorage.getItem("cooking_start_time");
        let elapsedSeconds = 0;
        if (startTimeStr) {
          const startTime = parseInt(startTimeStr);
          const now = Date.now();
          elapsedSeconds = Math.floor((now - startTime) / 1000);
        }

        const data = await getCompletionSummary(mealId, elapsedSeconds);
        setSummary(data);

        await AsyncStorage.removeItem("cooking_start_time");
      } catch (err) {
        console.error("Failed to fetch completion summary", err);
      }
    }

    fetchSummary();
  }, [mealId]);

  if (!summary) return null;

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

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image
          source={BasketImage}
          style={styles.basketImage}
          resizeMode="contain"
        />

        <View style={styles.textContainer}>
          <Text style={styles.title}>Awesome!!</Text>
          <Text style={styles.subText}>
            You earned {summary.total_score} Points for cooking{" "}
            {summary.meal_name}
          </Text>
          <Text style={styles.timeText}>⏱ {summary.elapsed_time}</Text>
        </View>

        {summary.feedback.map((item, index) => (
          <View key={index} style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Step {index + 1}</Text>

            {item.image_url && (
              <Image
                source={{ uri: item.image_url }}
                style={styles.stepImage}
                resizeMode="cover"
              />
            )}

            <Text style={styles.stepDescription}>
              <Text style={{ fontWeight: "bold" }}>
                {item.description || "Step description not available."}
              </Text>
            </Text>

            <Text style={styles.feedbackMessage}>
              {item.feedback || "No feedback provided."}
            </Text>

            <Text style={styles.score}>Score: {item.score ?? 0}</Text>
          </View>
        ))}

        <View style={styles.buttonContainer}>
          <Pressable
            style={styles.primaryButton}
            onPress={() =>
              router.push({
                pathname: "/(main)/review",
                params: { mealId },
              })
            }
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  svgContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "100%",
  },
  scrollContainer: {
    paddingBottom: 40,
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
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "black",
    marginBottom: 12,
  },
  subText: {
    fontSize: 16,
    color: "#444",
    textAlign: "center",
    marginBottom: 6,
  },
  timeText: {
    fontSize: 14,
    color: "#777",
  },
  stepContainer: {
    backgroundColor: "#F9F9F9",
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 15,
    borderRadius: 12,
    elevation: 1,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  stepImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 12,
  },
  stepDescription: {
    fontSize: 14,
    fontWeight: "600",
    color: "#222",
    marginBottom: 8,
  },
  feedbackMessage: {
    fontSize: 14,
    color: "#555",
    marginBottom: 6,
  },
  score: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#7D9A55",
  },
  buttonContainer: {
    marginTop: 30,
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
