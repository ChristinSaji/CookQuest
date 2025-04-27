import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  Image,
  Pressable,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import { BASE_IMAGE_URL, getChallenges } from "../../../utils/api";

export default function ChallengeScreen() {
  const router = useRouter();
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    setLoading(true);
    try {
      const data = await getChallenges();
      setChallenges(data);
    } catch (error) {
      console.error("Failed to fetch challenges:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ImageBackground
        source={require("../../../assets/images/bg-main.png")}
        className="flex-1"
        resizeMode="cover"
      >
        <View className="px-6 mt-8">
          <Text className="text-4xl font-bold text-black">Challenges</Text>
          <Text className="text-lg text-gray-500">
            Meals challenged by users
          </Text>
        </View>

        <View className="px-6 mt-16">
          {loading ? (
            <ActivityIndicator size="large" color="#A1B75A" />
          ) : challenges.length === 0 ? (
            <Text className="text-center text-gray-500 mt-10">
              No challenges found.
            </Text>
          ) : (
            <FlatList
              data={challenges}
              keyExtractor={(item) => item.meal.id}
              numColumns={2}
              columnWrapperStyle={{ justifyContent: "space-between" }}
              scrollEnabled={false}
              nestedScrollEnabled={true}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: "/(main)/meal-info",
                      params: { mealId: item.meal.id },
                    })
                  }
                  style={[
                    styles.card,
                    { backgroundColor: item.meal.bgColor || "#FFF" },
                  ]}
                >
                  <Image
                    source={{ uri: `${BASE_IMAGE_URL}${item.meal.image}` }}
                    className="w-full h-36"
                    resizeMode="contain"
                  />
                  <Text className="text-sm font-semibold text-black mt-2">
                    {item.meal.name}
                  </Text>
                  <Text className="text-xs text-gray-500 mt-1">
                    by {item.created_by}
                  </Text>
                  <View className="flex-row mt-1">
                    {[...Array(5)].map((_, index) => (
                      <FontAwesome
                        key={index}
                        name="star"
                        size={14}
                        color={index < item.meal.rating ? "#FFD700" : "#D1D5DB"}
                      />
                    ))}
                  </View>
                </Pressable>
              )}
            />
          )}
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "45%",
    borderRadius: 15,
    padding: 12,
    marginBottom: 35,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
