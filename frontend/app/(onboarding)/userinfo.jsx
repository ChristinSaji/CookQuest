import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  TextInput,
  useWindowDimensions,
  StyleSheet,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons, Feather } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState, useRef } from "react";

export default function UserInfoScreen() {
  const { width } = useWindowDimensions();
  const router = useRouter();

  const [bedtime, setBedtime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [age, setAge] = useState("23");
  const [weight, setWeight] = useState("60");
  const [height, setHeight] = useState("170");

  const ageInputRef = useRef(null);
  const weightInputRef = useRef(null);
  const heightInputRef = useRef(null);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <View className="flex-row items-center justify-between px-4 py-5">
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </Pressable>
        <Text className="text-lg font-bold text-black">Your Info</Text>
        <Image
          source={require("../../assets/images/profile-pic.png")}
          className="w-10 h-10 rounded-full"
        />
      </View>

      <ScrollView contentContainerStyle={styles.infoContainer}>
        <Pressable style={styles.infoRow} onPress={() => setShowPicker(true)}>
          <View className="flex-row items-center h-12">
            <Ionicons name="bed-outline" size={20} color="#B6B4C2" />
            <Text className="text-base text-gray-400 ml-2">Bedtime</Text>
          </View>
          <View className="flex-row items-center h-12">
            <Text className="text-base text-gray-500 mr-2">
              {bedtime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
            <Ionicons name="chevron-forward" size={18} color="#A5A3B0" />
          </View>
        </Pressable>
        {showPicker && (
          <DateTimePicker
            value={bedtime}
            mode="time"
            is24Hour={false}
            display="default"
            onChange={(event, selectedTime) => {
              setShowPicker(false);
              if (selectedTime) setBedtime(selectedTime);
            }}
          />
        )}

        <Pressable
          style={styles.infoRow}
          onPress={() => ageInputRef.current.focus()}
        >
          <View className="flex-row items-center h-12">
            <Feather name="clock" size={20} color="#B6B4C2" />
            <Text className="text-base text-gray-400 ml-2">Age</Text>
          </View>
          <View className="flex-row items-center h-12">
            <TextInput
              ref={ageInputRef}
              keyboardType="numeric"
              value={age}
              onChangeText={(text) => setAge(text)}
              maxLength={2}
              className="text-gray-500 text-base"
              style={styles.input}
            />
            <Ionicons name="chevron-forward" size={18} color="#A5A3B0" />
          </View>
        </Pressable>

        <Pressable
          style={styles.infoRow}
          onPress={() => weightInputRef.current.focus()}
        >
          <View className="flex-row items-center h-12">
            <Text className="text-base text-gray-400">Weight</Text>
          </View>
          <View className="flex-row items-center h-12">
            <TextInput
              ref={weightInputRef}
              keyboardType="numeric"
              value={weight}
              onChangeText={(text) => setWeight(text)}
              maxLength={3}
              className="text-gray-500 text-base"
              style={styles.input}
            />
            <Text className="text-gray-500">kg</Text>
            <Ionicons name="chevron-forward" size={18} color="#A5A3B0" />
          </View>
        </Pressable>

        <Pressable
          style={styles.infoRow}
          onPress={() => heightInputRef.current.focus()}
        >
          <View className="flex-row items-center h-12">
            <Text className="text-base text-gray-400">Height</Text>
          </View>
          <View className="flex-row items-center h-12">
            <TextInput
              ref={heightInputRef}
              keyboardType="numeric"
              value={height}
              onChangeText={(text) => setHeight(text)}
              maxLength={3}
              className="text-gray-500 text-base"
              style={styles.input}
            />
            <Text className="text-gray-500">cm</Text>
            <Ionicons name="chevron-forward" size={18} color="#A5A3B0" />
          </View>
        </Pressable>
      </ScrollView>

      <Pressable style={styles.continueButton}>
        <Text className="text-lg font-bold text-white text-center">
          Continue
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#F7F8F8",
    alignItems: "center",
    justifyContent: "center",
  },
  infoContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F7F8F8",
    paddingVertical: 18,
    paddingHorizontal: 15,
    borderRadius: 12,
    marginBottom: 12,
  },
  input: {
    width: 60,
    textAlign: "right",
    backgroundColor: "transparent",
  },
  continueButton: {
    backgroundColor: "#A1B75A",
    paddingVertical: 18,
    borderRadius: 30,
    width: "90%",
    alignSelf: "center",
    position: "absolute",
    bottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
});
