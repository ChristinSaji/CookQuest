import { useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  ImageBackground,
  ScrollView,
  FlatList,
  StatusBar,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker";

export default function DashboardScreen() {
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Breakfast");

  const categories = [
    { label: "Breakfast", value: "Breakfast" },
    { label: "Lunch", value: "Lunch" },
    { label: "Dinner", value: "Dinner" },
    { label: "Supper", value: "Supper" },
  ];

  const meals = [
    {
      id: "1",
      name: "Meal 1",
      image: require("../../assets/images/meal1.png"),
      rating: 4,
      bgColor: "#C9BBC7",
    },
    {
      id: "2",
      name: "Meal 2",
      image: require("../../assets/images/meal2.png"),
      rating: 3,
      bgColor: "#BDCB90",
    },
    {
      id: "3",
      name: "Fresh Fruit Salad",
      image: require("../../assets/images/meal3.png"),
      rating: 5,
      bgColor: "#D7E0E6",
    },
    {
      id: "4",
      name: "Caesar’s Salad",
      image: require("../../assets/images/meal4.png"),
      rating: 4,
      bgColor: "#F8DF9F",
    },
    {
      id: "5",
      name: "Vegan Delight",
      image: require("../../assets/images/meal5.png"),
      rating: 5,
      bgColor: "#FFE459",
    },
    {
      id: "6",
      name: "Protein Bowl",
      image: require("../../assets/images/meal6.png"),
      rating: 4,
      bgColor: "#B1F89F",
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <ImageBackground
        source={require("../../assets/images/bg-main.png")}
        className="flex-1"
        resizeMode="cover"
      >
        <ScrollView
          contentContainerStyle={{ paddingBottom: 100 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-row items-center justify-between px-4 py-5">
            <Pressable className="p-2">
              <Ionicons name="menu" size={28} color="black" />
            </Pressable>
            <Image
              source={require("../../assets/images/profile-pic.png")}
              className="w-10 h-10 rounded-full"
            />
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
            <FlatList
              data={meals}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={{ justifyContent: "space-between" }}
              scrollEnabled={false}
              nestedScrollEnabled={true}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <View style={[styles.card, { backgroundColor: item.bgColor }]}>
                  <Image
                    source={item.image}
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

                  <Pressable style={styles.hideButton}>
                    <Text className="text-white text-xs">Hide</Text>
                  </Pressable>
                </View>
              )}
            />
          </View>
        </ScrollView>
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
  hideButton: {
    backgroundColor: "#A1B75A",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignSelf: "flex-end",
    marginTop: 6,
  },
});
