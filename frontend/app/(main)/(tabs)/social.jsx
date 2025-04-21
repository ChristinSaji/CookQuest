import { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  Image,
  Pressable,
  StyleSheet,
  Linking,
} from "react-native";
import { useRouter } from "expo-router";
import { getReviews } from "../../../utils/api";

import LocalProfile from "../../../assets/images/profile-pic.png";
import DefaultPost from "../../../assets/images/default-post.jpg";

export default function SocialScreen() {
  const router = useRouter();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aspectRatios, setAspectRatios] = useState({});

  const recommendations = [
    { name: "Eric Arnold", followers: "998K" },
    { name: "Lucia Jones", followers: "243K" },
    { name: "Anisa Jones", followers: "111K" },
  ];

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getReviews();

        const ratioPromises = data.map((review, index) => {
          return new Promise((resolve) => {
            const imageUri = review.image_url;
            if (imageUri) {
              Image.getSize(
                imageUri,
                (width, height) => resolve({ index, ratio: width / height }),
                () => resolve({ index, ratio: 4 / 3 })
              );
            } else {
              resolve({ index, ratio: 4 / 3 });
            }
          });
        });

        const ratios = await Promise.all(ratioPromises);
        const ratioMap = {};
        ratios.forEach(({ index, ratio }) => {
          ratioMap[index] = ratio;
        });

        setAspectRatios(ratioMap);
        setReviews(data);
      } catch (error) {
        console.error("Failed to load reviews", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) {
    return <Text style={{ padding: 20 }}>Loading...</Text>;
  }

  // Image attribution (DefaultPost):
  // Photo by Todd Quackenbush on Unsplash
  // https://unsplash.com/photos/black-mortar-and-pestle-beside-brown-box-in-top-view-photography-x5SRhkFajrA

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.title}>Feed</Text>

        {reviews.map((review, index) => (
          <View key={index} style={styles.reviewCard}>
            <View
              style={[
                styles.imageWrapper,
                { aspectRatio: aspectRatios[index] || 4 / 3 },
              ]}
            >
              <Image
                source={
                  review.image_url ? { uri: review.image_url } : DefaultPost
                }
                style={styles.reviewImage}
                resizeMode="cover"
              />
            </View>

            <View style={styles.reviewHeader}>
              <Image source={LocalProfile} style={styles.profileImage} />
              <Text style={styles.userName}>
                {review.name} rated this recipe {review.rating} Stars!!
              </Text>
            </View>

            <View style={styles.reviewContent}>
              {review.meal_name && review.meal_id ? (
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: "/(main)/meal-info",
                      params: { mealId: review.meal_id },
                    })
                  }
                >
                  <Text
                    style={[
                      styles.mealName,
                      {
                        textDecorationLine: "underline",
                        color: "#7D9A55",
                      },
                    ]}
                  >
                    {review.meal_name}
                  </Text>
                </Pressable>
              ) : (
                <Text style={styles.mealName}>
                  {review.meal_name || "Unknown Meal"}
                </Text>
              )}
              <Text style={styles.reviewText}>{review.review}</Text>
            </View>
          </View>
        ))}

        <Text style={styles.recommendationsTitle}>Follow Recommendations</Text>
        {recommendations.map((user, index) => (
          <View key={index} style={styles.recommendation}>
            <Image source={LocalProfile} style={styles.recommendationImage} />
            <View>
              <Text style={styles.recommendationName}>{user.name}</Text>
              <Text style={styles.followerCount}>
                {user.followers} Followers
              </Text>
            </View>
            <Pressable style={styles.followButton}>
              <Text style={styles.followButtonText}>Follow</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 20,
  },
  reviewCard: {
    backgroundColor: "#F9F9F9",
    borderRadius: 16,
    marginBottom: 20,
    overflow: "hidden",
    elevation: 2,
  },
  imageWrapper: {
    width: "100%",
    backgroundColor: "#f0f0f0",
  },
  reviewImage: {
    flex: 1,
    width: "100%",
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    flexWrap: "wrap",
  },
  reviewContent: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  mealName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 4,
  },
  reviewText: {
    fontSize: 14,
    color: "#555",
  },
  recommendationsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  recommendation: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  recommendationImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  recommendationName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  followerCount: {
    fontSize: 12,
    color: "#888",
  },
  followButton: {
    backgroundColor: "#A1B75A",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginLeft: "auto",
  },
  followButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
