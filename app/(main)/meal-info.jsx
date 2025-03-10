import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  Image,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Ionicons,
  Entypo,
  MaterialCommunityIcons,
  AntDesign,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import BackgroundSvg from "../../assets/svgs/bg-meal.svg";

const { width, height } = Dimensions.get("window");

const ingredients = [
  {
    id: "1",
    name: "Strawberries",
    quantity: "400 grams",
    image: require("../../assets/images/strawberry.png"),
  },
  {
    id: "2",
    name: "Apples",
    quantity: "2",
    image: require("../../assets/images/apple.png"),
  },
  {
    id: "3",
    name: "Bananas",
    quantity: "2",
    image: require("../../assets/images/banana.png"),
  },
  {
    id: "4",
    name: "Kiwifruits",
    quantity: "3",
    image: require("../../assets/images/kiwi.png"),
  },
];

const nutrients = [
  { id: "1", name: "Calories", value: "142" },
  { id: "2", name: "Fat", value: "20 g" },
  { id: "3", name: "Fiber", value: "6 g" },
  { id: "4", name: "Vitamin", value: "2 mcg" },
  { id: "5", name: "Iron", value: "4 mg" },
];

export default function MealInfoScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Ingredients");
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.svgContainer}>
        <BackgroundSvg
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid slice"
        />
      </View>

      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="chevron-back" size={28} color="black" />
      </Pressable>

      <View style={styles.textContainer}>
        <Text style={styles.categoryText}>Breakfast</Text>
        <Text style={styles.mealName}>Meal 1</Text>
      </View>

      <View style={styles.mealImagesContainer}>
        <Image
          source={require("../../assets/images/meal8.png")}
          style={[styles.sideImage, { left: -45 }]}
        />
        <Image
          source={require("../../assets/images/meal7.png")}
          style={styles.centerImage}
        />
        <Image
          source={require("../../assets/images/meal9.png")}
          style={[styles.sideImage, { right: -45 }]}
        />
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Entypo name="back-in-time" size={18} color="#A1B75A" />
          <Text style={styles.infoText}>20 min</Text>
        </View>

        <View style={styles.infoItem}>
          <Ionicons name="flame-outline" size={18} color="#A1B75A" />
          <Text style={styles.infoText}>142 cal</Text>
        </View>

        <View style={styles.infoItem}>
          <MaterialCommunityIcons
            name="silverware-fork-knife"
            size={18}
            color="#A1B75A"
          />
          <Text style={styles.infoText}>Rated High!</Text>
        </View>
      </View>

      <View style={styles.toggleContainer}>
        <Pressable
          style={[
            styles.toggleButton,
            activeTab === "Ingredients" && styles.activeButton,
          ]}
          onPress={() => setActiveTab("Ingredients")}
        >
          <Text
            style={[
              styles.toggleText,
              activeTab === "Ingredients" && styles.activeText,
            ]}
          >
            Ingredients
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.toggleButton,
            activeTab === "Nutrients" && styles.activeButton,
          ]}
          onPress={() => setActiveTab("Nutrients")}
        >
          <Text
            style={[
              styles.toggleText,
              activeTab === "Nutrients" && styles.activeText,
            ]}
          >
            Nutrients
          </Text>
        </Pressable>
      </View>

      <View style={styles.infoSection}>
        {activeTab === "Ingredients" ? (
          <FlatList
            data={ingredients}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.ingredientItem}>
                <Image source={item.image} style={styles.ingredientImage} />
                <Text style={styles.ingredientName}>{item.name}</Text>
                <Text style={styles.ingredientQuantity}>{item.quantity}</Text>
              </View>
            )}
          />
        ) : (
          <FlatList
            data={nutrients}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.nutrientItem}>
                <Text style={styles.nutrientName}>{item.name}</Text>
                <Text style={styles.nutrientValue}>{item.value}</Text>
              </View>
            )}
          />
        )}
      </View>

      <View style={styles.bottomSection}>
        <Pressable
          style={styles.favoriteButton}
          onPress={() => setIsFavorite(!isFavorite)}
        >
          <AntDesign
            name={isFavorite ? "heart" : "hearto"}
            size={24}
            color="#A1B75A"
          />
        </Pressable>

        <Pressable style={styles.startCookingButton}>
          <Text style={styles.startCookingText}>Start Cooking</Text>
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
  svgContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "100%",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    padding: 10,
    zIndex: 10,
  },
  textContainer: {
    position: "absolute",
    top: "6%",
    alignItems: "center",
    width: "100%",
  },
  categoryText: {
    fontSize: 16,
    color: "black",
    opacity: 0.7,
    textAlign: "center",
  },
  mealName: {
    fontSize: 34,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    marginTop: 10,
  },
  mealImagesContainer: {
    position: "absolute",
    top: height * 0.13,
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  centerImage: {
    width: 250,
    height: 250,
    resizeMode: "contain",
    zIndex: 10,
  },
  sideImage: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    position: "absolute",
    top: 60,
  },
  infoContainer: {
    position: "absolute",
    top: height * 0.43,
    flexDirection: "row",
    justifyContent: "space-around",
    width: "85%",
    alignSelf: "center",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  infoText: {
    fontSize: 14,
    fontWeight: "600",
    color: "black",
    marginLeft: 5,
  },
  toggleContainer: {
    position: "absolute",
    top: height * 0.5,
    flexDirection: "row",
    alignSelf: "center",
    width: "85%",
    backgroundColor: "#E0E0E0",
    borderRadius: 25,
    padding: 5,
  },
  toggleButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 25,
  },
  activeButton: {
    backgroundColor: "#A1B75A",
  },
  toggleText: {
    fontSize: 16,
    fontWeight: "600",
    color: "black",
  },
  activeText: {
    color: "white",
  },
  infoSection: {
    position: "absolute",
    top: height * 0.57,
    width: "85%",
    alignSelf: "center",
    backgroundColor: "white",
  },
  ingredientItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderColor: "#E0E0E0",
  },
  ingredientImage: {
    width: 40,
    height: 40,
    marginRight: 12,
    resizeMode: "contain",
  },
  ingredientName: {
    flex: 1,
    fontSize: 16,
    color: "black",
    fontWeight: "500",
  },
  ingredientQuantity: {
    fontSize: 16,
    color: "gray",
    fontWeight: "500",
  },
  nutrientItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderColor: "#E0E0E0",
  },
  nutrientName: {
    fontSize: 16,
    color: "black",
    fontWeight: "500",
  },
  nutrientValue: {
    fontSize: 16,
    color: "gray",
    fontWeight: "500",
  },
  bottomSection: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 20,
    paddingHorizontal: 30,
    backgroundColor: "white",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: -8 },
    shadowRadius: 8,
    elevation: 10,
    borderWidth: 0.4,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  favoriteButton: {
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#A1B75A",
    borderRadius: 50,
    width: 55,
    height: 55,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 20,
  },
  favoriteActive: {
    backgroundColor: "white",
  },
  startCookingButton: {
    flex: 1,
    backgroundColor: "#A1B75A",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
  },
  startCookingText: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
  },
});
