import { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  StyleSheet,
  Pressable,
  FlatList,
  Image,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { getLeaderboard, getUserProfile } from "../../../utils/api";

import defaultMale from "../../../assets/images/default-pp-male.jpg";
import defaultFemale from "../../../assets/images/default-pp-female.jpg";

export default function LeaderboardScreen() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("week");
  const [gender, setGender] = useState("male");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const data = await getLeaderboard(activeTab);
        setLeaders(data);
      } catch (error) {
        console.error("Failed to load leaderboard", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchProfile = async () => {
      try {
        const profile = await getUserProfile();
        if (profile?.gender) {
          setGender(profile.gender);
        }
      } catch (error) {
        console.error("Failed to load user profile:", error);
      }
    };

    fetchLeaderboard();
    fetchProfile();
  }, [activeTab]);

  if (loading) {
    return <Text style={{ padding: 20 }}>Loading...</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.toggleContainer}>
        <Pressable
          style={[
            styles.toggleButton,
            activeTab === "week" && styles.activeButton,
          ]}
          onPress={() => setActiveTab("week")}
        >
          <Text
            style={[
              styles.toggleText,
              activeTab === "week" && styles.activeText,
            ]}
          >
            This Week
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.toggleButton,
            activeTab === "month" && styles.activeButton,
          ]}
          onPress={() => setActiveTab("month")}
        >
          <Text
            style={[
              styles.toggleText,
              activeTab === "month" && styles.activeText,
            ]}
          >
            This Month
          </Text>
        </Pressable>
      </View>

      <Text style={styles.leaderboardTitle}>Leaderboard</Text>

      <FlatList
        data={leaders}
        keyExtractor={(item) => item.user_id}
        contentContainerStyle={{ paddingTop: 10 }}
        renderItem={({ item, index }) => (
          <View
            style={[styles.leaderboardItem, index === 0 && { marginTop: 10 }]}
          >
            <View style={styles.rankContainer}>
              {index < 3 ? (
                <FontAwesome5
                  name="trophy"
                  size={26}
                  color={
                    index === 0
                      ? "#FFD700"
                      : index === 1
                      ? "#C0C0C0"
                      : "#CD7F32"
                  }
                />
              ) : (
                <View style={styles.rankBadge}>
                  <Text style={styles.rankText}>{index + 1}</Text>
                </View>
              )}
            </View>

            <View style={styles.verticalDivider} />

            <View style={styles.userInfo}>
              <Image
                source={gender === "female" ? defaultFemale : defaultMale}
                style={styles.profileImage}
              />
              <Text style={styles.userName}>{item.name || "Unknown"}</Text>
            </View>

            <View style={styles.verticalDivider} />

            <View style={styles.scoreContainer}>
              <Text style={styles.userScore}>{item.total_score} pts</Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingHorizontal: 10,
    paddingTop: 15,
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#E0E0E0",
    borderRadius: 20,
    padding: 3,
    marginBottom: 20,
    width: "95%",
    alignSelf: "center",
  },
  toggleButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 20,
  },
  activeButton: {
    backgroundColor: "#A1B75A",
  },
  toggleText: {
    fontSize: 14,
    fontWeight: "600",
    color: "black",
  },
  activeText: {
    color: "white",
  },
  leaderboardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 12,
  },
  leaderboardItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 14,
    width: "98%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    elevation: 4,
  },
  rankContainer: {
    flex: 1.25,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 7,
  },
  rankBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#D3D3D3",
    alignItems: "center",
    justifyContent: "center",
  },
  rankText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "black",
  },
  verticalDivider: {
    width: 2,
    backgroundColor: "#F5F5F5",
    height: "100%",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 5,
    paddingVertical: 7,
  },
  profileImage: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginLeft: 5,
    marginRight: 10,
  },
  userName: {
    fontSize: 14,
    fontWeight: "500",
  },
  scoreContainer: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 7,
  },
  userScore: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
});
