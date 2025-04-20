import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  Image,
  Pressable,
  ImageBackground,
  FlatList,
  StatusBar,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker";
import { getRecipes } from "../../../utils/api";

export default function RecipesScreen() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Breakfast");
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);

  const categories = [
    { label: "Breakfast", value: "Breakfast" },
    { label: "Lunch", value: "Lunch" },
    { label: "Dinner", value: "Dinner" },
    { label: "Supper", value: "Supper" },
  ];

  useEffect(() => {
    fetchRecipes();
  }, [selectedCategory]);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const data = await getRecipes(selectedCategory);
      setMeals(data);
    } catch (error) {
      console.error("Failed to fetch recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <ImageBackground
        source={require("../../../assets/images/bg-main.png")}
        className="flex-1"
        resizeMode="cover"
      >
        <View className="flex-row items-center justify-between px-4 py-5">
          <Pressable className="p-2">
            <Ionicons name="menu" size={28} color="black" />
          </Pressable>
          <Pressable onPress={() => router.push("/(onboarding)/userinfo")}>
            <Image
              source={require("../../../assets/images/profile-pic.png")}
              className="w-10 h-10 rounded-full"
            />
          </Pressable>
        </View>

        <View className="px-6 mt-8">
          <Text className="text-4xl font-bold text-black">Recipes</Text>
          <Text className="text-lg text-gray-500">
            The perfect healthy food
          </Text>
        </View>

        <View className="px-6 mt-6 z-50">
          <DropDownPicker
            open={open}
            value={selectedCategory}
            items={categories}
            setOpen={setOpen}
            setValue={setSelectedCategory}
            placeholder="Select Category"
            style={styles.dropdown}
            textStyle={styles.dropdownText}
            dropDownContainerStyle={styles.dropdownContainer}
          />
        </View>

        <View className="px-6 mt-16">
          {loading ? (
            <ActivityIndicator size="large" color="#A1B75A" />
          ) : (
            <FlatList
              data={meals}
              keyExtractor={(item) => item.id}
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
                      params: { mealId: item.id },
                    })
                  }
                  style={[
                    styles.card,
                    { backgroundColor: item.bgColor || "#FFF" },
                  ]}
                >
                  <Image
                    source={{ uri: `http://192.168.2.154:8000${item.image}` }}
                    className="w-full h-36"
                    resizeMode="contain"
                  />
                  <Text className="text-sm font-semibold text-black mt-2">
                    {item.name}
                  </Text>
                  <View className="flex-row mt-1">
                    {[...Array(5)].map((_, index) => (
                      <FontAwesome
                        key={index}
                        name="star"
                        size={14}
                        color={index < item.rating ? "#FFD700" : "#D1D5DB"}
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
  dropdown: {
    backgroundColor: "white",
    borderColor: "#D1D5DB",
    borderWidth: 1,
    borderRadius: 8,
  },
  dropdownText: {
    fontSize: 16,
    color: "#4B5563",
  },
  dropdownContainer: {
    backgroundColor: "white",
    borderColor: "#D1D5DB",
  },
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
