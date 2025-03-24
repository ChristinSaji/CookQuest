import smtplib
from email.message import EmailMessage
import os
from dotenv import load_dotenv

load_dotenv()

EMAIL_HOST = os.getenv("EMAIL_HOST")
EMAIL_PORT = int(os.getenv("EMAIL_PORT", 587))
EMAIL_USERNAME = os.getenv("EMAIL_USERNAME")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")

def send_reset_email(to_email: str, token: str):
    msg = EmailMessage()
    msg["Subject"] = "CookQuest - Password Reset"
    msg["From"] = EMAIL_USERNAME
    msg["To"] = to_email

    msg.set_content(f"Here is your password reset token:\n\n{token}\n\nCopy and paste this in the app to reset your password.")

    with smtplib.SMTP(EMAIL_HOST, EMAIL_PORT) as server:
        server.starttls()
        server.login(EMAIL_USERNAME, EMAIL_PASSWORD)
        server.send_message(msg)
