import {
  View,
  Text,
  Pressable,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5 } from "@expo/vector-icons";
import { useState } from "react";

const leaderboardData = [
  {
    id: "1",
    rank: 1,
    name: "Paul C. Ramos",
    score: 5075,
    image: require("../../../assets/images/profile-pic.png"),
  },
  {
    id: "2",
    rank: 2,
    name: "Derrick L. Thoman",
    score: 4985,
    image: require("../../../assets/images/profile-pic.png"),
  },
  {
    id: "3",
    rank: 3,
    name: "Kelsey T. Donovan",
    score: 4642,
    image: require("../../../assets/images/profile-pic.png"),
  },
  {
    id: "4",
    rank: 4,
    name: "Jack L. Gregory",
    score: 3874,
    image: require("../../../assets/images/profile-pic.png"),
  },
  {
    id: "5",
    rank: 5,
    name: "Mary R. Mercado",
    score: 3567,
    image: require("../../../assets/images/profile-pic.png"),
  },
  {
    id: "6",
    rank: 6,
    name: "Theresa N. Maki",
    score: 3478,
    image: require("../../../assets/images/profile-pic.png"),
  },
  {
    id: "7",
    rank: 7,
    name: "Jack L. Gregory",
    score: 3387,
    image: require("../../../assets/images/profile-pic.png"),
  },
  {
    id: "8",
    rank: 8,
    name: "James R. Stokes",
    score: 3257,
    image: require("../../../assets/images/profile-pic.png"),
  },
  {
    id: "9",
    rank: 9,
    name: "David B. Rodriguez",
    score: 3250,
    image: require("../../../assets/images/profile-pic.png"),
  },
  {
    id: "10",
    rank: 10,
    name: "Annette R. Allen",
    score: 3212,
    image: require("../../../assets/images/profile-pic.png"),
  },
];

export default function LeaderboardScreen() {
  const [activeTab, setActiveTab] = useState("week");

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
        data={leaderboardData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: 10 }}
        renderItem={({ item, index }) => (
          <View
            style={[styles.leaderboardItem, index === 0 && { marginTop: 10 }]}
          >
            <View style={styles.rankContainer}>
              {item.rank <= 3 ? (
                <FontAwesome5
                  name="trophy"
                  size={26}
                  color={
                    item.rank === 1
                      ? "#FFD700"
                      : item.rank === 2
                      ? "#C0C0C0"
                      : "#CD7F32"
                  }
                />
              ) : (
                <View style={styles.rankBadge}>
                  <Text style={styles.rankText}>{item.rank}</Text>
                </View>
              )}
            </View>

            <View style={styles.verticalDivider} />

            <View style={styles.userInfo}>
              <Image source={item.image} style={styles.profileImage} />
              <Text style={styles.userName}>{item.name}</Text>
            </View>

            <View style={styles.verticalDivider} />

            <View style={styles.scoreContainer}>
              <Text style={styles.userScore}>{item.score}</Text>
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
