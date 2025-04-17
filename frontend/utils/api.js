const BASE_URL = "http://192.168.2.154:8000";

export async function signupUser({ name, email, password }) {
  try {
    const response = await fetch(`${BASE_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || "Signup failed");
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function loginUser({ email, password }) {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Login failed");
  }
  return data;
}

export async function forgotPassword(email) {
  const response = await fetch(`${BASE_URL}/auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to send reset email.");
  }

  return data;
}

export async function resetPassword(token, new_password) {
  const response = await fetch(`${BASE_URL}/auth/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token, new_password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Reset failed");
  }

  return data;
}

export async function getRecipes(category = "Breakfast") {
  try {
    const response = await fetch(`${BASE_URL}/recipes?category=${category}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Failed to fetch recipes");
    }

    return data;
  } catch (error) {
    throw error;
  }
}

export async function validateStep({ photoUri, stepIndex, maxAttempts = 3 }) {
  const wait = (ms) => new Promise((res) => setTimeout(res, ms));

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
