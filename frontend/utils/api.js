import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

export const BASE_URL = Constants.expoConfig?.extra?.BASE_URL;
export const BASE_IMAGE_URL = Constants.expoConfig?.extra?.BASE_IMAGE_URL;

export async function saveToken(token) {
  try {
    await AsyncStorage.setItem("access_token", token);
  } catch (e) {
    console.error("Error saving token", e);
  }
}

export async function getToken() {
  try {
    return await AsyncStorage.getItem("access_token");
  } catch (e) {
    console.error("Error retrieving token", e);
    return null;
  }
}

export async function removeToken() {
  try {
    await AsyncStorage.removeItem("access_token");
  } catch (e) {
    console.error("Error removing token", e);
  }
}

export async function signupUser({ name, email, password }) {
  const response = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Signup failed");

  if (data.access_token) await saveToken(data.access_token);
  return data;
}

export async function loginUser({ email, password }) {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Login failed");

  if (data.access_token) await saveToken(data.access_token);
  return data;
}

export async function forgotPassword(email) {
  const response = await fetch(`${BASE_URL}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();
  if (!response.ok)
    throw new Error(data.detail || "Failed to send reset email.");
  return data;
}

export async function resetPassword(token, new_password) {
  const response = await fetch(`${BASE_URL}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, new_password }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Reset failed");
  return data;
}

export async function getUserProfile() {
  const token = await getToken();

  const response = await fetch(`${BASE_URL}/auth/user/me`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Failed to fetch profile");
  return data;
}

export async function updateUserProfile(profileData) {
  const token = await getToken();

  const response = await fetch(`${BASE_URL}/auth/user/update-profile`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(profileData),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Failed to update profile");
  return data;
}

export async function likeMeal(mealId) {
  const token = await getToken();

  const response = await fetch(`${BASE_URL}/auth/user/like-meal`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ meal_id: mealId }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Failed to like meal");

  return data;
}

export async function unlikeMeal(mealId) {
  const token = await getToken();

  const response = await fetch(`${BASE_URL}/auth/user/unlike-meal`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ meal_id: mealId }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Failed to unlike meal");

  return data;
}

export async function getLikedMeals() {
  const token = await getToken();

  const response = await fetch(`${BASE_URL}/auth/user/liked-meals`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json();
  if (!response.ok)
    throw new Error(data.detail || "Failed to fetch liked meals");

  return data.liked_meals;
}

export async function getRecipes(category = "Breakfast") {
  const token = await getToken();

  const response = await fetch(`${BASE_URL}/recipes?category=${category}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Failed to fetch recipes");
  return data;
}

export async function getRecipeById(mealId) {
  const token = await getToken();

  const response = await fetch(`${BASE_URL}/recipes/${mealId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Failed to fetch recipe");
  return data;
}

export async function getChallenges() {
  const token = await getToken();

  const response = await fetch(`${BASE_URL}/challenges`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok)
    throw new Error(data.detail || "Failed to fetch challenges");

  return data;
}

export async function getMealSteps(mealId) {
  const token = await getToken();

  const response = await fetch(`${BASE_URL}/meal-steps/${mealId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json();
  if (!response.ok)
    throw new Error(data.detail || "Failed to fetch meal steps");
  return data.steps;
}

export async function validateStep({
  photoUri,
  stepIndex,
  mealId,
  maxAttempts = 3,
}) {
  const wait = (ms) => new Promise((res) => setTimeout(res, ms));
  const token = await getToken();

  const formData = new FormData();
  formData.append("file", {
    uri: photoUri.startsWith("file://") ? photoUri : `file://${photoUri}`,
    name: `step_${stepIndex}.jpg`,
    type: "image/jpeg",
  });
  formData.append("step_index", stepIndex || "0");
  formData.append("meal_id", mealId);

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await wait(200);
      const res = await fetch(`${BASE_URL}/validate-step/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      const result = await res.json();
      if (!res.ok || !result.success) throw new Error("Upload failed");
      return result;
    } catch (err) {
      console.warn(`Upload attempt ${attempt} failed`, err);
      if (attempt === maxAttempts) throw err;
      await wait(400);
    }
  }
}

export async function resetCookingSession() {
  try {
    await AsyncStorage.removeItem("cooking_start_time");
  } catch (e) {
    console.error("Failed to reset cooking session:", e);
  }
}

export function formatElapsedTime(seconds = 0) {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return `${minutes}m ${remaining}s`;
}

export async function getCompletionSummary(mealId, elapsedTime = null) {
  const token = await getToken();

  let url = `${BASE_URL}/completion-summary/${mealId}`;
  if (elapsedTime !== null) {
    url += `?elapsed_time=${elapsedTime}`;
  }

  const response = await fetch(url, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Failed to fetch summary");
  return data;
}

export async function submitReview(formData) {
  const token = await getToken();

  const response = await fetch(`${BASE_URL}/review`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Review submission failed");

  return data;
}

export async function getReviews() {
  const token = await getToken();

  const response = await fetch(`${BASE_URL}/reviews`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Failed to fetch reviews");
  return data;
}

export async function getHistory() {
  const token = await getToken();

  const response = await fetch(`${BASE_URL}/history`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Failed to fetch history");

  return data;
}

export async function getLeaderboard(period = "week") {
  const token = await getToken();

  const response = await fetch(`${BASE_URL}/leaderboard?period=${period}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok)
    throw new Error(data.detail || "Failed to fetch leaderboard");

  return data;
}
