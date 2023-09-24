
import random
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Function to generate a 6-digit OTP
def generate_otp():
    return str(random.randint(100000, 999999))

# Function to send OTP via email
def send_otp_via_email(email, otp):
    sender_email = "your_email@gmail.com"  # Your email address
    sender_password = "your_password"       # Your email password
    subject = "Your OTP"
    message = f"Your OTP is: {otp}"

    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = email
    msg['Subject'] = subject
    msg.attach(MIMEText(message, 'plain'))

    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()
    server.login(sender_email, sender_password)
    server.sendmail(sender_email, email, msg.as_string())
    server.quit()

# Usage example
user_email = "user@example.com"
otp = generate_otp()
send_otp_via_email(user_email, otp)
