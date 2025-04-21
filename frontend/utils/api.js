import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://192.168.2.154:8000";

async function saveToken(token) {
  try {
    await AsyncStorage.setItem("access_token", token);
  } catch (e) {
    console.error("Error saving token", e);
  }
}

async function getToken() {
  try {
    return await AsyncStorage.getItem("access_token");
  } catch (e) {
    console.error("Error retrieving token", e);
    return null;
  }
}

async function removeToken() {
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

export async function getRecipes(category = "Breakfast") {
  const token = await getToken();

  const response = await fetch(`${BASE_URL}/recipes?category=${category}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Failed to fetch recipes");
  return data;
}

export async function getRecipeById(mealId) {
  const token = await getToken();

  const response = await fetch(`${BASE_URL}/recipes/${mealId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Failed to fetch recipe");

  return data;
}

export async function validateStep({ photoUri, stepIndex, maxAttempts = 3 }) {
  const wait = (ms) => new Promise((res) => setTimeout(res, ms));
  const token = await getToken();

  const formData = new FormData();
  formData.append("file", {
    uri: photoUri.startsWith("file://") ? photoUri : `file://${photoUri}`,
    name: `step_${stepIndex}.jpg`,
    type: "image/jpeg",
  });
  formData.append("step_index", stepIndex || "0");

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

export async function submitReview(formData) {
  const token = await getToken();

  const response = await fetch(`${BASE_URL}/review`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Review submission failed");

  return data;
}
