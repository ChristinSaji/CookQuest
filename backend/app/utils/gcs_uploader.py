from google.cloud import storage
from fastapi import UploadFile
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

CREDENTIALS_PATH = os.getenv("GCP_CREDENTIALS_PATH")
BUCKET_NAME = os.getenv("GCP_BUCKET_NAME")

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = CREDENTIALS_PATH

def upload_to_gcs(file: UploadFile, user_email: str, meal_id: str, step_index: int) -> str:
    client = storage.Client()
    bucket = client.bucket(BUCKET_NAME)

    blob_name = f"step-validations/{user_email}/meal_{meal_id}_step_{step_index}.jpg"

    blob = bucket.blob(blob_name)
    blob.upload_from_file(file.file, content_type=file.content_type)

    return blob.public_url

def upload_review_image_to_gcs(file: UploadFile, user_email: str) -> str:
    client = storage.Client()
    bucket = client.bucket(BUCKET_NAME)

    timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    blob_name = f"reviews/{user_email}/review_{timestamp}.jpg"

    blob = bucket.blob(blob_name)
    blob.upload_from_file(file.file, content_type=file.content_type)

    return blob.public_url
