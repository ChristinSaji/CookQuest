import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  StatusBar,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { AntDesign, FontAwesome } from "@expo/vector-icons";

import BackgroundSvg from "../../assets/svgs/bg-review.svg";
import BasketImage from "../../assets/images/vegetable-basket.png";

const { width, height } = Dimensions.get("window");

export default function ReviewScreen() {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  const handleSubmit = () => {
    console.log({ rating, review });
    setSubmitted(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#A1B75A" />
      <View style={styles.svgContainer}>
        <BackgroundSvg
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid slice"
        />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Image
            source={BasketImage}
            style={styles.basketImage}
            resizeMode="contain"
          />

          <View style={styles.content}>
            <Text style={styles.title}>
              We would love to get your review on it!
            </Text>

            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Pressable key={star} onPress={() => setRating(star)}>
                  <AntDesign
                    name={star <= rating ? "star" : "staro"}
                    size={32}
                    color="#FFD700"
                    style={styles.starIcon}
                  />
                </Pressable>
              ))}
            </View>

            <TextInput
              placeholder="Write your review..."
              value={review}
              onChangeText={setReview}
              multiline
              style={styles.input}
            />

            <Pressable style={styles.submitButton} onPress={handleSubmit}>
              <FontAwesome name="paper-plane" size={20} color="#fff" />
            </Pressable>

            {submitted && (
              <Text style={styles.thanksText}>
                Thanks for sharing your review
              </Text>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: "flex-start",
    paddingTop: height * 0.1,
  },
  basketImage: {
    width: width * 1.2,
    height: height * 0.5,
    alignSelf: "flex-end",
    marginTop: -height * 0.1,
    marginRight: -width * 0.3,
  },
  content: {
    marginTop: 40,
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  title: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  stars: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  starIcon: {
    marginHorizontal: 5,
  },
  input: {
    backgroundColor: "#F4F4F4",
    height: 140,
    borderRadius: 10,
    padding: 12,
    textAlignVertical: "top",
    marginBottom: 20,
  },
  submitButton: {
    alignSelf: "center",
    backgroundColor: "#A1B75A",
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  thanksText: {
    textAlign: "center",
    color: "#888",
    fontSize: 14,
    marginTop: 10,
  },
});
