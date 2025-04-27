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
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker";
import {
  BASE_IMAGE_URL,
  getRecipes,
  getUserProfile,
  getLikedMeals,
  removeToken,
} from "../../../utils/api";

const defaultMale = require("../../../assets/images/default-pp-male.jpg");
const defaultFemale = require("../../../assets/images/default-pp-female.jpg");

export default function RecipesScreen() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Breakfast");
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [gender, setGender] = useState("male");
  const [userName, setUserName] = useState("");
  const [showDrawer, setShowDrawer] = useState(false);

  const categories = [
    { label: "Breakfast", value: "Breakfast" },
    { label: "Lunch", value: "Lunch" },
    { label: "Dinner", value: "Dinner" },
    { label: "Supper", value: "Supper" },
    { label: "Liked Meals", value: "Liked Meals" },
  ];

  useEffect(() => {
    fetchRecipes();
  }, [selectedCategory]);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      if (selectedCategory === "Liked Meals") {
        const likedMealIds = await getLikedMeals();
        if (likedMealIds.length === 0) {
          setMeals([]);
          return;
        }

        const categoriesToFetch = ["Breakfast", "Lunch", "Dinner", "Supper"];
        let allMeals = [];

        for (const category of categoriesToFetch) {
          const mealsInCategory = await getRecipes(category);
          allMeals = [...allMeals, ...mealsInCategory];
        }

        const likedMealsData = allMeals.filter((meal) =>
          likedMealIds.includes(meal.id)
        );

        setMeals(likedMealsData);
      } else {
        const data = await getRecipes(selectedCategory);
        setMeals(data);
      }
    } catch (error) {
      console.error("Failed to fetch recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const profile = await getUserProfile();
      if (profile?.gender) {
        setGender(profile.gender);
      }
      if (profile?.name) {
        setUserName(profile.name);
      }
    } catch (error) {
      console.error("Failed to load user profile:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await removeToken();
      router.replace("/(auth)/signin");
    } catch (error) {
      console.error("Failed to logout:", error);
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
          <Pressable className="p-2" onPress={() => setShowDrawer(true)}>
            <Ionicons name="menu" size={28} color="black" />
          </Pressable>
          <Pressable onPress={() => router.push("/(onboarding)/profile")}>
            <Image
              source={gender === "female" ? defaultFemale : defaultMale}
              className="w-10 h-10 rounded-full"
            />
          </Pressable>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={showDrawer}
          onRequestClose={() => setShowDrawer(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.drawerContainer}>
              <View className="items-center mt-8">
                <Image
                  source={gender === "female" ? defaultFemale : defaultMale}
                  style={{ width: 80, height: 80, borderRadius: 40 }}
                />
                <Text className="mt-2 text-lg font-bold text-black">
                  {userName}
                </Text>
              </View>

              <View className="mt-10 px-8">
                <Pressable
                  onPress={() => {
                    router.push("/(onboarding)/profile");
                    setShowDrawer(false);
                  }}
                >
                  <Text className="text-base text-black mb-5">My Profile</Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    setSelectedCategory("Liked Meals");
                    setShowDrawer(false);
                  }}
                >
                  <Text className="text-base text-black mb-5">Liked Meals</Text>
                </Pressable>
              </View>

              <View className="flex-1 justify-end pb-10 px-8">
                <Pressable onPress={handleLogout} style={styles.logoutButton}>
                  <Text style={styles.logoutText}>Log Out</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

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
          ) : meals.length === 0 ? (
            <Text className="text-center text-gray-500 mt-10">
              No meals found.
            </Text>
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
                    source={{ uri: `${BASE_IMAGE_URL}${item.image}` }}
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-start",
  },
  drawerContainer: {
    backgroundColor: "white",
    width: "70%",
    height: "100%",
    paddingTop: 40,
    paddingBottom: 20,
  },
  logoutButton: {
    backgroundColor: "#A1B75A",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  logoutText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
