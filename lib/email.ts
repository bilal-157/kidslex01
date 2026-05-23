import nodemailer from 'nodemailer';

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendLoginNotificationEmail(userEmail: string, userName: string) {
  const loginTime = new Date().toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'medium',
  });
  
  // Get IP and location info (optional - add if you have this data)
  const deviceInfo = {
    browser: 'Unknown Browser',
    os: 'Unknown OS',
    ip: 'Unable to detect',
  };

  try {
    await transporter.sendMail({
      from: `"KidsLX Security" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: '🔐 Security Alert: New sign-in to your KidsLX account',
      priority: 'high',
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
      },
      text: `
Dear ${userName},

SECURITY NOTIFICATION

We detected a new sign-in to your KidsLX account.

Sign-in Details:
• Time: ${loginTime}
• Account: ${userEmail}

If this was you:
✓ No action is needed. You can safely ignore this email.

If this wasn't you:
• Your account may be compromised
• Reset your password immediately: ${process.env.NEXTAUTH_URL}/reset-password
• Contact our support team: support@kidslx.com

For your security, never share your password with anyone.

Best regards,
KidsLX Security Team
© ${new Date().getFullYear()} KidsLX. All rights reserved.
      `,
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Security Alert - KidsLX</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f0faf4; line-height: 1.6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0faf4; padding: 40px 20px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table width="100%" max-width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 24px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08); overflow: hidden;">
          
          <!-- Header with Branding -->
          <tr>
            <td style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 40px 30px; text-align: center;">
              <div style="font-size: 48px; margin-bottom: 12px;">🛡️</div>
              <h1 style="color: #ffffff; font-size: 28px; font-weight: 800; margin: 0; letter-spacing: -0.5px;">KidsLX</h1>
              <p style="color: #dcfce7; font-size: 14px; margin: 8px 0 0 0;">Security Notification</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <!-- Greeting -->
              <div style="margin-bottom: 30px;">
                <h2 style="color: #1f2937; font-size: 22px; font-weight: 700; margin: 0 0 8px 0;">Dear ${userName},</h2>
                <p style="color: #4b5563; font-size: 16px; margin: 0;">We detected a new sign-in to your KidsLX account.</p>
              </div>
              
              <!-- Alert Box -->
              <div style="background-color: #fef9c3; border-left: 4px solid #eab308; padding: 20px; border-radius: 12px; margin-bottom: 32px;">
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                  <span style="font-size: 24px;">⚠️</span>
                  <strong style="color: #854d0e; font-size: 16px;">Security Alert</strong>
                </div>
                <p style="color: #854d0e; margin: 0 0 8px 0; font-size: 14px;">If this wasn't you, your account may be at risk.</p>
              </div>
              
              <!-- Sign-in Details -->
              <div style="background-color: #f9fafb; border-radius: 16px; padding: 24px; margin-bottom: 32px;">
                <h3 style="color: #374151; font-size: 16px; font-weight: 700; margin: 0 0 16px 0;">📋 Sign-in Details</h3>
                <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 14px;">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; width: 100px;">Time:</td>
                    <td style="padding: 8px 0; color: #1f2937; font-weight: 500;">${loginTime}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;">Account:</td>
                    <td style="padding: 8px 0; color: #1f2937; font-weight: 500;">${userEmail}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;">Status:</td>
                    <td style="padding: 8px 0;">
                      <span style="background-color: #dcfce7; color: #166534; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">✅ Successful</span>
                    </td>
                  </tr>
                </table>
              </div>
              
              <!-- Action Buttons -->
              <div style="margin-bottom: 32px;">
                <p style="color: #4b5563; font-size: 14px; margin-bottom: 16px;"><strong>Was this you?</strong> No action needed.</p>
                <p style="color: #4b5563; font-size: 14px; margin-bottom: 16px;"><strong>Wasn't you?</strong> Secure your account immediately:</p>
                
                <div style="text-align: center;">
                  <a href="${process.env.NEXTAUTH_URL}/auth/reset-password" style="display: inline-block; background-color: #22c55e; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 700; font-size: 14px; margin-bottom: 12px; transition: background-color 0.3s;">🔒 Reset Password Now</a>
                </div>
                
                <div style="text-align: center;">
                  <a href="mailto:support@kidslx.com" style="color: #22c55e; text-decoration: none; font-size: 13px; font-weight: 600;">Contact Support →</a>
                </div>
              </div>
              
              <!-- Security Tips -->
              <div style="background-color: #f0f9ff; border-radius: 12px; padding: 20px; margin-bottom: 32px;">
                <h4 style="color: #1e3a8a; font-size: 14px; font-weight: 700; margin: 0 0 12px 0;">🛡️ Security Tips</h4>
                <ul style="color: #3b82f6; font-size: 13px; margin: 0; padding-left: 20px;">
                  <li style="margin-bottom: 8px;">Never share your password with anyone</li>
                  <li style="margin-bottom: 8px;">Use a unique password for KidsLX</li>
                  <li>Enable two-factor authentication for extra security</li>
                </ul>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 24px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0 0 12px 0;">
                KidsLX - Safe Learning for Kids<br>
                This is an automated security notification
              </p>
              <p style="color: #d1d5db; font-size: 11px; margin: 0;">
                © ${new Date().getFullYear()} KidsLX. All rights reserved.
              </p>
              <p style="color: #d1d5db; font-size: 10px; margin: 8px 0 0 0;">
                If you didn't request this email, please ignore it or contact support.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    });
    
    console.log(`✓ Login notification email sent successfully to: ${userEmail}`);
    return { success: true };
  } catch (error) {
    console.error('✗ Failed to send login email:', error);
    // Don't throw error - login should work even if email fails
    return { success: false, error };
  }
}

// NEW: Send OTP Email for Password Reset
export async function sendOTPEmail(userEmail: string, otp: string, userName: string) {
  try {
    await transporter.sendMail({
      from: `"KidsLX Security" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: '🔐 Password Reset OTP - KidsLX',
      priority: 'high',
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
      },
      text: `
Dear ${userName},

PASSWORD RESET OTP

Your OTP for password reset is: ${otp}

This OTP is valid for 5 minutes.

If you didn't request this, please ignore this email.

Best regards,
KidsLX Security Team
© ${new Date().getFullYear()} KidsLX. All rights reserved.
      `,
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset OTP - KidsLX</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f0faf4; line-height: 1.6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0faf4; padding: 40px 20px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table width="100%" max-width="500" cellpadding="0" cellspacing="0" style="max-width: 500px; width: 100%; background-color: #ffffff; border-radius: 24px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08); overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 30px; text-align: center;">
              <div style="font-size: 48px;">🔐</div>
              <h1 style="color: #ffffff; font-size: 24px; font-weight: 800; margin: 10px 0 0 0;">Password Reset OTP</h1>
              <p style="color: #dcfce7; font-size: 14px; margin: 8px 0 0 0;">Verification Code</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: #1f2937; font-size: 20px; font-weight: 700; margin: 0 0 10px 0;">Dear ${userName},</h2>
              <p style="color: #4b5563; font-size: 16px; margin-bottom: 24px;">Use the following OTP to reset your password:</p>
              
              <!-- OTP Code Box -->
              <div style="background-color: #f0faf4; padding: 24px; text-align: center; border-radius: 16px; margin-bottom: 24px; border: 2px dashed #22c55e;">
                <p style="font-size: 40px; font-weight: 800; letter-spacing: 8px; color: #16a34a; margin: 0; font-family: 'Courier New', monospace;">${otp}</p>
              </div>
              
              <!-- Alert Box -->
              <div style="background-color: #fef9c3; border-left: 4px solid #eab308; padding: 15px; border-radius: 8px; margin-bottom: 24px;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                  <span style="font-size: 20px;">⏰</span>
                  <strong style="color: #854d0e; font-size: 14px;">Time Sensitive</strong>
                </div>
                <p style="color: #854d0e; margin: 0; font-size: 13px;">This OTP is valid for <strong>5 minutes</strong> only.</p>
              </div>
              
              <!-- Security Note -->
              <div style="background-color: #f0f9ff; border-radius: 12px; padding: 15px; margin-bottom: 24px;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                  <span style="font-size: 16px;">🛡️</span>
                  <strong style="color: #1e3a8a; font-size: 13px;">Security Note</strong>
                </div>
                <p style="color: #3b82f6; font-size: 12px; margin: 0;">
                  Never share this OTP with anyone. KidsLX will never ask for your password or OTP.
                </p>
              </div>
              
              <p style="color: #6b7280; font-size: 13px; margin-top: 20px; text-align: center;">
                If you didn't request this, please ignore this email.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0 0 8px 0;">
                KidsLX - Safe Learning for Kids
              </p>
              <p style="color: #d1d5db; font-size: 11px; margin: 0;">
                © ${new Date().getFullYear()} KidsLX. All rights reserved.
              </p>
              <p style="color: #d1d5db; font-size: 10px; margin: 8px 0 0 0;">
                This is an automated message, please do not reply.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    });
    
    console.log(`✓ OTP email sent successfully to: ${userEmail}`);
    return true;
  } catch (error) {
    console.error('✗ Failed to send OTP email:', error);
    return false;
  }
}

// Optional: Send Password Reset Confirmation Email
export async function sendPasswordResetConfirmationEmail(userEmail: string, userName: string) {
  const resetTime = new Date().toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  try {
    await transporter.sendMail({
      from: `"KidsLX Security" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: '✅ Password Reset Successful - KidsLX',
      priority: 'high',
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
      },
      text: `
Dear ${userName},

PASSWORD RESET CONFIRMATION

Your password was successfully reset at: ${resetTime}

If you did this:
✓ No further action is needed. You can now sign in with your new password.

If you didn't do this:
• Your account may be compromised
• Contact our support team immediately: support@kidslx.com

Best regards,
KidsLX Security Team
© ${new Date().getFullYear()} KidsLX. All rights reserved.
      `,
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Successful - KidsLX</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f0faf4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0faf4; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="500" cellpadding="0" cellspacing="0" style="max-width: 500px; background-color: #ffffff; border-radius: 24px; box-shadow: 0 8px 32px rgba(0,0,0,0.08); overflow: hidden;">
          <td style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 30px; text-align: center;">
            <div style="font-size: 48px;">✅</div>
            <h1 style="color: #ffffff; font-size: 24px; font-weight: 800; margin: 10px 0 0 0;">Password Reset</h1>
            <p style="color: #dcfce7; font-size: 14px; margin: 8px 0 0 0;">Successful</p>
          </td>
          <td style="padding: 40px 30px;">
            <h2 style="color: #1f2937; font-size: 20px; margin: 0 0 10px 0;">Dear ${userName},</h2>
            <p style="color: #4b5563; margin-bottom: 20px;">Your password was successfully reset.</p>
            <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 15px; margin-bottom: 20px;">
              <p style="margin: 0; color: #166534; font-size: 14px;">
                <strong>📅 Reset Time:</strong> ${resetTime}<br>
                <strong>🔐 Account:</strong> ${userEmail}
              </p>
            </div>
            <div style="text-align: center;">
              <a href="${process.env.NEXTAUTH_URL}/auth/sign-in" style="display: inline-block; background-color: #22c55e; color: white; text-decoration: none; padding: 12px 32px; border-radius: 12px; font-weight: 700;">
                Sign In Now →
              </a>
            </div>
          </td>
          <td style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; font-size: 11px; margin: 0;">© ${new Date().getFullYear()} KidsLX. All rights reserved.</p>
          </td>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    });
    
    console.log(`✓ Password reset confirmation sent to: ${userEmail}`);
    return { success: true };
  } catch (error) {
    console.error('✗ Failed to send confirmation email:', error);
    return { success: false, error };
  }
}