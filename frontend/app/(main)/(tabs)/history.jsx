import { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  Image,
  Pressable,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { getHistory } from "../../../utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

export default function HistoryScreen() {
  const router = useRouter();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getHistory();
        setHistory(data);
      } catch (error) {
        console.error("Failed to load history", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return <Text style={{ padding: 20 }}>Loading...</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.title}>Your Cooking History</Text>

        {history.length === 0 && (
          <Text
            style={{
              textAlign: "center",
              marginTop: 20,
              fontSize: 16,
              color: "#888",
            }}
          >
            No completed meals yet. Start cooking!
          </Text>
        )}

        {history.map((meal, index) => (
          <View key={index} style={styles.historyCard}>
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/(main)/meal-info",
                  params: { mealId: meal.meal_id },
                })
              }
            >
              <Text style={styles.mealName}>{meal.meal_name}</Text>
            </Pressable>

            <Text style={styles.completedTime}>
              Completed {formatCompletedTime(meal.completed_at)}
            </Text>

            <Text style={styles.elapsedTime}>
              Cooking Time: {meal.elapsed_time || "Unknown"}
            </Text>

            <Text style={styles.totalScore}>
              Total Score: {meal.total_score}
            </Text>

            {meal.steps.map((step, idx) => (
              <View key={idx} style={styles.stepItem}>
                {step.image_url && (
                  <Image
                    source={{ uri: step.image_url }}
                    style={styles.stepImage}
                    resizeMode="cover"
                  />
                )}
                <Text style={styles.stepDescription}>
                  <Text style={{ fontWeight: "bold" }}>
                    {step.description || "Step description not available."}
                  </Text>
                </Text>
                <Text style={styles.feedbackMessage}>
                  {step.feedback || "No feedback provided."}
                </Text>
                <Text style={styles.stepScore}>Score: {step.score ?? 0}</Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function formatCompletedTime(completed_at) {
  if (!completed_at) return "Unknown time";

  const time = dayjs(completed_at);
  const now = dayjs();

  if (time.isAfter(now)) {
    return time.format("MMMM D, YYYY h:mm A");
  } else if (now.diff(time, "hour") < 24) {
    return time.fromNow();
  } else {
    return time.format("MMMM D, YYYY h:mm A");
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 20,
  },
  historyCard: {
    backgroundColor: "#F9F9F9",
    borderRadius: 16,
    marginBottom: 20,
    overflow: "hidden",
    elevation: 2,
    padding: 12,
  },
  mealName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#7D9A55",
    marginBottom: 6,
    textDecorationLine: "underline",
  },
  completedTime: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  elapsedTime: {
    fontSize: 14,
    color: "#555",
    marginBottom: 6,
  },
  totalScore: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  stepItem: {
    marginBottom: 15,
  },
  stepImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 14,
    fontWeight: "600",
    color: "#222",
    marginBottom: 4,
  },
  feedbackMessage: {
    fontSize: 14,
    color: "#555",
    marginBottom: 2,
  },
  stepScore: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#7D9A55",
  },
});
