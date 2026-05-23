# 🚀 KidsLX - Authentication System

A complete authentication system with email verification, password reset, and security notifications built with Next.js 14, MongoDB, and Nodemailer.

## ✨ Features

- ✅ User Registration with Email
- ✅ Secure Login with Password Hashing (bcrypt)
- ✅ Forgot Password with OTP Verification
- ✅ Email Notifications for Login Alerts
- ✅ Password Reset with 5-Minute OTP Expiry
- ✅ Responsive UI with Tailwind CSS
- ✅ MongoDB Database Integration
- ✅ Professional Email Templates

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (local or cloud) - [MongoDB Atlas Free Tier](https://www.mongodb.com/cloud/atlas)
- **npm** or **yarn** or **pnpm** (comes with Node.js)
- **Git** (optional, for cloning)

## 🛠️ Installation

### Step 1: Get the Project

**Option A: Download ZIP**
1. Extract the ZIP file
2. Open terminal in the project folder

**Option B: Clone Repository**
```bash
git clone <your-repository-url>
cd kidslx
```

### Step 2: Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Step 3: Set Up Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# ========================================
# MONGODB DATABASE (REQUIRED)
# ========================================
# Local MongoDB (default)
MONGODB_URI=mongodb://localhost:27017/kidslx

# OR MongoDB Atlas (cloud)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kidslx

# ========================================
# EMAIL CONFIGURATION (OPTIONAL but recommended)
# ========================================
# For Gmail:
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-digit-app-password

# For Outlook/Hotmail:
# EMAIL_USER=your-email@outlook.com
# EMAIL_PASS=your-password

# ========================================
# APP CONFIGURATION (REQUIRED)
# ========================================
NEXTAUTH_URL=http://localhost:3000

# ========================================
# JWT SECRET (Optional - for JWT auth)
# ========================================
JWT_SECRET=your-super-secret-jwt-key-here
```

### Step 4: Set Up MongoDB

#### Option A: Local MongoDB (Easiest for Development)

1. **Install MongoDB Community Edition**
   - [Download for Windows/Mac/Linux](https://www.mongodb.com/try/download/community)

2. **Start MongoDB Service**
   ```bash
   # Windows
   net start MongoDB
   
   # Mac (with Homebrew)
   brew services start mongodb-community
   
   # Linux (Ubuntu)
   sudo systemctl start mongod
   ```

3. **Verify MongoDB is running**
   ```bash
   mongosh
   # Should connect to MongoDB shell
   ```

#### Option B: MongoDB Atlas (Cloud - No Installation)

1. **Create a free account** at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

2. **Create a new cluster** (Free tier is sufficient)

3. **Get your connection string**
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `username`, `password`, and `cluster` in the string

4. **Whitelist your IP address** (0.0.0.0/0 for development)

### Step 5: Set Up Email (Gmail)

To send emails, you need to configure Gmail with an App Password:

1. **Enable 2-Factor Authentication** on your Google Account
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Click on "2-Step Verification" and enable it

2. **Generate an App Password**
   - Go to [App Passwords](https://myaccount.google.com/apppasswords)
   - Select App: **Mail**
   - Select Device: **Other (Custom name)**
   - Enter name: "KidsLX-Development"
   - Click **Generate**

3. **Copy the 16-character password** (spaces don't matter)
   - Example: `abcd efgh ijkl mnop`
   - Add to `.env.local` without spaces: `abcdefghijklmnop`

> **Note:** If emails don't work locally, check your terminal console - the OTP will be logged there for testing.

### Step 6: Run the Application

**Development Mode:**
```bash
npm run dev
# Open http://localhost:3000
```

**Production Build:**
```bash
npm run build
npm start
# Open http://localhost:3000
```

## 🗂️ Project Structure

```
kidslx/
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── login/           # Login API
│   │       ├── register/        # Registration API
│   │       ├── send-otp/        # Send OTP API
│   │       ├── verify-otp/      # Verify OTP API
│   │       └── reset-password/  # Reset password API
│   └── auth/
│       ├── sign-in/             # Login page
│       ├── sign-up/             # Registration page
│       └── forget-password/     # Forgot password page
├── lib/
│   ├── mongodb.ts               # Database connection
│   ├── email.ts                 # Email utilities
│   └── otp.ts                   # OTP utilities
├── models/
│   ├── User.ts                  # User model
│   └── OTP.ts                   # OTP model
├── public/                       # Static assets
├── .env.local                    # Environment variables
├── package.json                  # Dependencies
└── README.md                     # This file
```

## 🚀 Usage Guide

### 1. Create an Account

1. Navigate to `/auth/sign-up`
2. Fill in your details:
   - Full Name
   - Email Address
   - Password (min 6 characters)
3. Click "Sign Up"
4. You'll be redirected to login page

### 2. Login to Your Account

1. Navigate to `/auth/sign-in`
2. Enter your email and password
3. Click "Sign In"
4. You'll receive a login notification email

### 3. Reset Forgotten Password

1. Click "Forgot Password?" on login page
2. Enter your email address
3. Check your email for 6-digit OTP
4. Enter the OTP on the verification page
5. Set your new password
6. Login with your new password

## 🧪 Testing the Application

### Test User Credentials

After registration, use these to test:

```javascript
Email: test@example.com
Password: Test123456
```

### Test Email (Development Only)

If email is not configured, check your terminal for OTP:

```bash
✅ OTP generated for user@example.com: 123456
📧 Sending email with OTP: 123456
```

### MongoDB Inspection

View database contents:
```bash
mongosh
use kidslx
db.users.find().pretty()
db.otps.find().pretty()
```

## 🔧 Troubleshooting Guide

### MongoDB Connection Error

**Error:** `MongooseServerSelectionError`
**Solution:**
- Check if MongoDB is running: `mongosh`
- Verify connection string in `.env.local`
- For Atlas, check IP whitelist
- Try: `mongodb://localhost:27017/kidslx`

### Email Not Sending

**Error:** `Invalid login or password`
**Solution:**
- Enable 2FA on Gmail
- Generate new App Password
- Remove spaces from App Password
- Check if using correct email

**Error:** `Email not configured`
**Solution:**
- OTP will be logged in terminal
- Use console OTP for testing
- Or configure email properly

### OTP Verification Fails

**Error:** `Invalid OTP`
**Solution:**
- Check OTP in terminal console
- Ensure OTP is 6 digits
- OTP expires after 5 minutes
- Request new OTP if expired

### Login Not Working

**Error:** `Invalid email or password`
**Solution:**
- Check if account exists in MongoDB
- Reset password using forgot password
- Ensure password is min 6 characters
- Check if password was hashed correctly

### Build Errors

**Error:** `Module not found`
**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Error:** `TypeScript errors`
**Solution:**
```bash
npx tsc --noEmit
# Fix any type errors
```

## 📦 Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables:
   - `MONGODB_URI`
   - `EMAIL_USER`
   - `EMAIL_PASS`
   - `NEXTAUTH_URL`
5. Deploy!

### Deploy to Render

1. Push code to GitHub
2. Go to [Render](https://render.com)
3. Create new Web Service
4. Connect repository
5. Add build command: `npm run build`
6. Add start command: `npm start`
7. Add environment variables
8. Deploy!

## 🔒 Security Features

- ✅ Passwords hashed with bcrypt (12 salt rounds)
- ✅ OTP expires after 5 minutes
- ✅ Maximum 5 OTP verification attempts
- ✅ OTP can only be used once
- ✅ MongoDB injection protection
- ✅ Environment variables for secrets
- ✅ Email notifications for logins

## 📊 Database Schema

### Users Collection
```javascript
{
  fullName: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### OTPs Collection
```javascript
{
  email: String,
  otp: String,
  expiresAt: Date (5 minutes),
  isUsed: Boolean,
  attempts: Number (max 5),
  createdAt: Date
}
```

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is for educational purposes. All rights reserved.

## 📧 Support

For issues or questions:

- Create an issue in the repository
- Email: support@kidslx.com
- Documentation: [Link to docs]

## 🎯 Environment Variables Quick Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `MONGODB_URI` | ✅ Yes | - | MongoDB connection string |
| `EMAIL_USER` | ⚠️ No | - | Gmail/Outlook email for notifications |
| `EMAIL_PASS` | ⚠️ No | - | App password for email |
| `NEXTAUTH_URL` | ✅ Yes | `http://localhost:3000` | App base URL |
| `JWT_SECRET` | ⚠️ No | - | Secret for JWT tokens |

## 🚀 Quick Start for New Users

```bash
# 1. Clone/download project
# 2. Install dependencies
npm install

# 3. Create .env.local file
echo "MONGODB_URI=mongodb://localhost:27017/kidslx" > .env.local
echo "NEXTAUTH_URL=http://localhost:3000" >> .env.local

# 4. Start MongoDB (if local)
mongod

# 5. Run the app
npm run dev

# 6. Open browser
open http://localhost:3000
```

## 🎉 Success!

You should now have a fully functioning authentication system. If you encounter any issues, refer to the troubleshooting section above.

**Happy Coding!** 🚀
```

This README includes:
- ✅ Complete setup instructions
- ✅ Environment variables explanation
- ✅ MongoDB setup (local and cloud)
- ✅ Email configuration guide
- ✅ Troubleshooting common errors
- ✅ Deployment guides
- ✅ Database schemas
- ✅ Security features
- ✅ Quick start commands

Anyone with basic Node.js knowledge can now set up and run your project! 🎯
