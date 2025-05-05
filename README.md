# 🥗 CookQuest – Healthy Eating Gamified

## 1. Project's Title

**CookQuest** — A gamified healthy eating app that motivates users to cook nutritious meals, follow step-by-step instructions, and earn scores based on their cooking accuracy, validated using AI.

---

## 2. Project Description

**CookQuest** is designed to promote healthier eating habits by combining cooking with gamification and AI. Users participate in cooking challenges, select meals, and upload cooking step photos which are evaluated by a visual language model for feedback and scoring.

This project blends health, education, and fun by leveraging the latest in mobile app development, cloud services, and generative AI models.

### Key Features:

- Step-by-step cooking instructions
- Meal photo validation using Qwen2.5-VL-3B (LLM)
- User reviews, score history, and social feed
- Cloud storage for images and robust backend APIs
- Dynamic leaderboard based on performance

### Technologies Used:

- **Frontend:** React Native (Expo), NativeWind, Tailwind CSS
- **Backend:** FastAPI, MongoDB Atlas, Google Cloud Storage, JWT Auth
- **AI/ML:** Qwen2.5-VL-3B-Instruct (Vision-Language Model)

---

## 3. Table of Contents

- [Installation](#installation)
- [Environment Configuration](#env-setup)
- [Usage](#usage)
- [Credits](#credits)

---

## 4. How to Install and Run the Project <a name="installation"></a>

### 🔧 Prerequisites

- Node.js (LTS)
- Expo CLI
- Python 3.10+
- MongoDB Atlas
- Google Cloud Project + Bucket
- GCP Service Account JSON

### 🔧 Setup Frontend

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory:

```env
BASE_URL=http://your-backend-domain.com/cookquest/api
BASE_IMAGE_URL=http://your-backend-domain.com/cookquest/api
```

Run the frontend:

```bash
npx expo start -c
```

### ⚙️ Setup Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
```

Create a `.env` file in the `backend/` directory:

```env
MONGO_URI="mongodb+srv://<username>:<password>@cluster.mongodb.net/cookquest"
SECRET_KEY=your_secret_key_here

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USERNAME=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
RESET_PASSWORD_URL=http://localhost:8081/reset-password

# Google Cloud Storage
GCP_CREDENTIALS_PATH=app/credentials/your-service-account.json
GCP_BUCKET_NAME=cookquest-uploads
```

Run the backend:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## 📦 .env Setup Details <a name="env-setup"></a>

### 🌐 Frontend `.env` Overview

| Variable         | Description                                 |
| ---------------- | ------------------------------------------- |
| `BASE_URL`       | Backend base URL with `/cookquest/api` path |
| `BASE_IMAGE_URL` | Used for loading static assets from backend |

### 🔑 Backend `.env` Overview

| Variable                            | Description                                  |
| ----------------------------------- | -------------------------------------------- |
| `MONGO_URI`                         | MongoDB connection string (e.g., from Atlas) |
| `SECRET_KEY`                        | Key for JWT encryption                       |
| `EMAIL_HOST` / `EMAIL_PORT`         | SMTP settings (e.g., Gmail)                  |
| `EMAIL_USERNAME` / `EMAIL_PASSWORD` | SMTP account credentials                     |
| `RESET_PASSWORD_URL`                | Frontend link for password reset flow        |
| `GCP_CREDENTIALS_PATH`              | Path to GCS service account key JSON         |
| `GCP_BUCKET_NAME`                   | GCS bucket name for uploads                  |

---

## 5. How to Use the Project <a name="usage"></a>

- **Sign Up / Log In** using your email
- Choose a meal from the recipe list
- Follow each cooking step and upload a photo
- Receive AI-based feedback and scores
- Track your progress in history and view leaderboard
- Submit reviews with optional images after completing meals

---

## 6. Credits <a name="credits"></a>

**Author & Developer:**  
[Christin Saji](https://www.linkedin.com/in/christin-saji-b31398138/) – Full Stack Developer

**Supervisors:**

- Dr. Rita Orji
- Dr. Grace Ataguba

**Technologies/Resources Referenced:**

- [Qwen2.5-VL-3B Model (Hugging Face)](https://huggingface.co/Qwen/Qwen2.5-VL-3B-Instruct)
- [Google Cloud Storage](https://cloud.google.com/storage)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

> For questions or contributions, feel free to fork the repo or raise issues!
