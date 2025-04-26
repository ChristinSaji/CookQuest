import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  TextInput,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState, useRef, useEffect } from "react";
import { getUserProfile, updateUserProfile } from "../../utils/api";

const defaultMale = require("../../assets/images/default-pp-male.jpg");
const defaultFemale = require("../../assets/images/default-pp-female.jpg");

export default function ProfileScreen() {
  const router = useRouter();

  const [bedtime, setBedtime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("male");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");

  const nameInputRef = useRef(null);
  const ageInputRef = useRef(null);
  const weightInputRef = useRef(null);
  const heightInputRef = useRef(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getUserProfile();
        setName(data.name || "");
        setEmail(data.email || "");
        setGender(data.gender || "male");
        setAge(data.age ? String(data.age) : "");
        setWeight(data.weight ? String(data.weight) : "");
        setHeight(data.height ? String(data.height) : "");
        setBedtime(data.bedtime ? new Date(data.bedtime) : new Date());
      } catch (error) {
        console.error("Failed to load profile", error);
      }
    }
    loadProfile();
  }, []);

  const handleSave = async () => {
    try {
      await updateUserProfile({
        name,
        gender,
        age: age ? parseInt(age) : null,
        height: height ? parseInt(height) : null,
        weight: weight ? parseInt(weight) : null,
        bedtime: bedtime ? bedtime.toISOString() : null,
      });
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile", error);
      Alert.alert("Error", "Failed to update profile");
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <Text style={styles.backIcon}>{"<"}</Text>
            </Pressable>
            <Text style={styles.headerTitle}>Profile</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.profileSection}>
            <Image
              source={gender === "male" ? defaultMale : defaultFemale}
              style={styles.profileImage}
            />
            <Text style={styles.userName}>{name}</Text>
            <Text style={styles.userEmail}>{email}</Text>
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              ref={nameInputRef}
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
            />
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.label}>Age</Text>
            <TextInput
              ref={ageInputRef}
              style={styles.textInput}
              keyboardType="numeric"
              value={age}
              onChangeText={setAge}
              placeholder="Enter your age"
            />
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.genderRow}>
              <Pressable
                onPress={() => setGender("male")}
                style={[
                  styles.genderOption,
                  gender === "male" && styles.genderSelected,
                ]}
              >
                <Text
                  style={[
                    styles.genderText,
                    gender === "male" && styles.genderTextSelected,
                  ]}
                >
                  Male
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setGender("female")}
                style={[
                  styles.genderOption,
                  gender === "female" && styles.genderSelected,
                ]}
              >
                <Text
                  style={[
                    styles.genderText,
                    gender === "female" && styles.genderTextSelected,
                  ]}
                >
                  Female
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.label}>Height (cm)</Text>
            <TextInput
              ref={heightInputRef}
              style={styles.textInput}
              keyboardType="numeric"
              value={height}
              onChangeText={setHeight}
              placeholder="Enter your height"
            />
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.label}>Weight (kg)</Text>
            <TextInput
              ref={weightInputRef}
              style={styles.textInput}
              keyboardType="numeric"
              value={weight}
              onChangeText={setWeight}
              placeholder="Enter your weight"
            />
          </View>

          <Pressable
            style={styles.inputRow}
            onPress={() => setShowPicker(true)}
          >
            <Text style={styles.label}>Bedtime</Text>
            <Text style={styles.textInput}>
              {bedtime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </Pressable>

          {showPicker && (
            <View style={{ marginVertical: 10 }}>
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
            </View>
          )}
        </ScrollView>

        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 140,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#F7F8F8",
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  changePhotoText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#7D9A55",
    marginBottom: 8,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  userEmail: {
    fontSize: 14,
    color: "#777",
  },
  inputRow: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: "#555",
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: "#F7F8F8",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    color: "#333",
  },
  genderRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 8,
  },
  genderOption: {
    flex: 1,
    marginHorizontal: 4,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#E0E0E0",
    alignItems: "center",
  },
  genderSelected: {
    backgroundColor: "#A1B75A",
  },
  genderText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
  },
  genderTextSelected: {
    color: "white",
  },
  saveButton: {
    backgroundColor: "#A1B75A",
    paddingVertical: 18,
    borderRadius: 30,
    width: "90%",
    alignSelf: "center",
    marginBottom: 20,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
});
