import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Tuple
from app.core.config import settings

class GoogleSMTPService:
    """
    Enterprise Email Delivery service powered by Google SMTP (smtp.gmail.com).
    Supports STARTTLS authentication, HTML email templates, and development logging fallback.
    """
    def __init__(self):
        self.host = settings.SMTP_HOST or "smtp.gmail.com"
        self.port = settings.SMTP_PORT or 587
        self.user = settings.SMTP_USER
        self.password = settings.SMTP_PASSWORD
        self.from_email = settings.SMTP_FROM_EMAIL or settings.SMTP_USER or "no-reply@marginpilot.ai"
        self.from_name = settings.SMTP_FROM_NAME or "MarginPilot AI"

    def is_configured(self) -> bool:
        return bool(self.user and self.password and len(self.password) >= 8)

    def send_verification_email(self, to_email: str, recipient_name: str, verification_code: str) -> Tuple[bool, str]:
        """
        Sends a 6-digit email verification code via Google SMTP.
        Falls back gracefully to secure console logging if credentials are not yet configured.
        """
        subject = f"{verification_code} is your MarginPilot AI verification code"

        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }}
            .container {{ max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }}
            .header {{ background: #0f172a; padding: 32px; text-align: center; }}
            .brand {{ color: #ffffff; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; text-decoration: none; }}
            .badge {{ background: #2563eb; color: #ffffff; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 9999px; margin-left: 6px; }}
            .content {{ padding: 36px 32px; }}
            h2 {{ font-size: 20px; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 12px; }}
            p {{ font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 16px 0; }}
            .code-box {{ background: #f1f5f9; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }}
            .code {{ font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #2563eb; font-family: monospace; }}
            .expiry {{ font-size: 12px; color: #64748b; margin-top: 8px; }}
            .footer {{ background: #f8fafc; padding: 20px 32px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #94a3b8; }}
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <span class="brand">MarginPilot<span class="badge">AI</span></span>
            </div>
            <div class="content">
              <h2>Verify your email address</h2>
              <p>Hi {recipient_name},</p>
              <p>Thank you for creating your MarginPilot AI workspace. Please enter the verification code below to confirm your account and activate your 14-day free trial:</p>
              
              <div class="code-box">
                <div class="code">{verification_code}</div>
                <div class="expiry">Valid for 15 minutes • Do not share this code</div>
              </div>
              
              <p style="font-size: 13px; color: #64748b;">If you did not request this verification code, please ignore this email or reach out to security@marginpilot.ai.</p>
            </div>
            <div class="footer">
              © 2026 MarginPilot AI, Inc. Enterprise Business Intelligence &amp; Decision Automation.
            </div>
          </div>
        </body>
        </html>
        """

        text_content = f"Hi {recipient_name},\n\nYour MarginPilot AI verification code is: {verification_code}\n\nThis code expires in 15 minutes."

        # If Google SMTP is not configured or in tests, log code cleanly
        if not self.is_configured() or os.environ.get("TESTING") == "true":
            print(f"\n==================================================")
            print(f"[GOOGLE SMTP SIMULATION] Target: {to_email}")
            print(f"[GOOGLE SMTP SIMULATION] Code:   {verification_code}")
            print(f"[GOOGLE SMTP SIMULATION] Status: Logged (Add SMTP_USER & SMTP_PASSWORD to .env for live dispatch)")
            print(f"==================================================\n")
            return True, "Simulation: code logged to terminal"

        # Dispatch via Google SMTP
        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = f"{self.from_name} <{self.from_email}>"
            msg["To"] = to_email

            part1 = MIMEText(text_content, "plain")
            part2 = MIMEText(html_content, "html")
            msg.attach(part1)
            msg.attach(part2)

            with smtplib.SMTP(self.host, self.port, timeout=10) as server:
                server.ehlo()
                server.starttls()
                server.ehlo()
                server.login(self.user, self.password)
                server.sendmail(self.from_email, [to_email], msg.as_string())

            print(f"[GOOGLE SMTP] Successfully delivered verification email to {to_email}")
            return True, "Email sent successfully"
        except Exception as e:
            print(f"[GOOGLE SMTP ERROR] Failed to send email to {to_email}: {e}")
            # Do not fail user registration if SMTP network times out; allow user to enter code
            return False, str(e)

    def send_password_reset_email(self, to_email: str, recipient_name: str, reset_link: str) -> Tuple[bool, str]:
        """
        Sends a secure password reset link via Google SMTP.
        Falls back gracefully to secure console logging if SMTP is in simulation or test mode.
        """
        subject = "Reset your MarginPilot AI password"

        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }}
            .container {{ max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }}
            .header {{ background: #0f172a; padding: 32px; text-align: center; }}
            .brand {{ color: #ffffff; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; text-decoration: none; }}
            .badge {{ background: #2563eb; color: #ffffff; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 9999px; margin-left: 6px; }}
            .content {{ padding: 36px 32px; }}
            h2 {{ font-size: 20px; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 12px; }}
            p {{ font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 16px 0; }}
            .btn-wrapper {{ text-align: center; margin: 28px 0; }}
            .btn {{ display: inline-block; background-color: #2563eb; color: #ffffff !important; font-size: 14px; font-weight: 700; text-decoration: none; padding: 14px 28px; border-radius: 10px; box-shadow: 0 2px 4px rgba(37,99,235,0.2); }}
            .expiry-box {{ background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 16px; font-size: 12px; color: #64748b; margin-top: 20px; }}
            .link-alt {{ font-size: 11px; color: #94a3b8; word-break: break-all; margin-top: 16px; }}
            .link-alt a {{ color: #2563eb; text-decoration: underline; }}
            .footer {{ background: #f8fafc; padding: 20px 32px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #94a3b8; }}
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <span class="brand">MarginPilot<span class="badge">AI</span></span>
            </div>
            <div class="content">
              <h2>Reset Your Password</h2>
              <p>Hi {recipient_name},</p>
              <p>We received a request to reset the password for your MarginPilot AI account. Click the button below to choose a new password:</p>
              
              <div class="btn-wrapper">
                <a href="{reset_link}" target="_blank" class="btn">Reset Password</a>
              </div>
              
              <div class="expiry-box">
                ⏱️ <strong>Security Notice:</strong> This password reset link is valid for <strong>30 minutes</strong> and can only be used once.
              </div>

              <div class="link-alt">
                If the button above does not work, copy and paste this link into your browser:<br>
                <a href="{reset_link}">{reset_link}</a>
              </div>
              
              <p style="font-size: 12px; color: #94a3b8; margin-top: 24px;">If you did not request a password reset, you can safely ignore this email. Your password will not change unless you click the link above.</p>
            </div>
            <div class="footer">
              © 2026 MarginPilot AI, Inc. Enterprise Business Intelligence &amp; Decision Automation.
            </div>
          </div>
        </body>
        </html>
        """

        text_content = (
            f"Hi {recipient_name},\n\n"
            f"We received a request to reset the password for your MarginPilot AI account.\n\n"
            f"Please visit the following link to choose a new password:\n{reset_link}\n\n"
            f"This link expires in 30 minutes.\n\n"
            f"If you did not request this, please ignore this email."
        )

        # If Google SMTP is not configured or in tests, log cleanly
        if not self.is_configured() or os.environ.get("TESTING") == "true":
            print(f"\n==================================================")
            print(f"[GOOGLE SMTP SIMULATION] Target: {to_email}")
            print(f"[GOOGLE SMTP SIMULATION] Reset Link: {reset_link}")
            print(f"[GOOGLE SMTP SIMULATION] Status: Logged (Add SMTP_USER & SMTP_PASSWORD to .env for live dispatch)")
            print(f"==================================================\n")
            return True, "Simulation: reset link logged to terminal"

        # Dispatch via Google SMTP
        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = f"{self.from_name} <{self.from_email}>"
            msg["To"] = to_email

            part1 = MIMEText(text_content, "plain")
            part2 = MIMEText(html_content, "html")
            msg.attach(part1)
            msg.attach(part2)

            with smtplib.SMTP(self.host, self.port, timeout=10) as server:
                server.ehlo()
                server.starttls()
                server.ehlo()
                server.login(self.user, self.password)
                server.sendmail(self.from_email, [to_email], msg.as_string())

            print(f"[GOOGLE SMTP] Successfully delivered password reset email to {to_email}")
            return True, "Email sent successfully"
        except Exception as e:
            print(f"[GOOGLE SMTP ERROR] Failed to send password reset email to {to_email}: {e}")
            return False, str(e)

email_service = GoogleSMTPService()
