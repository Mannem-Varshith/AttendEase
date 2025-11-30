# AttendEase - Employee Attendance Management System

A modern, full-stack Employee Attendance Management System built with React and Node.js, featuring role-based access control, real-time attendance tracking, intelligent business rules, and comprehensive reporting capabilities.

![Tech Stack](https://img.shields.io/badge/MongoDB-4.4+-green) ![Node.js](https://img.shields.io/badge/Node.js-16+-blue) ![React](https://img.shields.io/badge/React-19+-blue) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-blue)

---

## 👨‍💻 Developer

**Mannem Varshith**  
🎓 Mohan Babu University  
📞 +91 9032612597

---

## 📋 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [Attendance Business Rules](#-attendance-business-rules)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Test Credentials](#-test-credentials)

---

## ✨ Features

### For Employees
- ✅ **Smart Check-In/Check-Out**: Confirmation modals with real-time clock display
- ⏰ **Late Arrival Warnings**: Shows exact lateness (hours/minutes) before checking in
- 🚫 **Weekend Detection**: Blocks check-in on Saturdays and Sundays with day-off message
- 📊 **Personal Dashboard**: View attendance statistics with monthly summaries
- 📅 **Attendance History**: Browse personal attendance records with filters
- 👤 **Profile Management**: View and update personal information

### For Managers
- 📈 **Team Dashboard**: Overview of team attendance statistics with real-time data
- 👥 **All Attendance View**: Monitor all employee attendance records
- 📊 **Reports & Analytics**: Generate and export CSV reports with filters
- 🔍 **Advanced Filtering**: Filter by status, department, date range
- ➕ **Create Employee Accounts**: Manager-only employee account creation (no public registration)
- 📋 **Employee Management**: Full control over employee onboarding

### Attendance Business Rules
- 🕐 **9:00 AM**: Late arrival threshold (shows exact lateness)
- 🕐 **1:00 PM**: Check-in deadline (marked as leave after this)
- ⏱️ **4 Hours**: Minimum work hours (less than 4 = marked as leave)
- 🕔 **5:00 PM**: Half-day cut-off (checkout before 5 PM = half-day status)
- 🚫 **Weekend Block**: No check-in allowed on Saturday/Sunday

### General
- 🔐 **Secure Authentication**: JWT-based authentication with role-based access
- 🔒 **Manager-Only Registration**: No public self-registration (managers create accounts)
- 📱 **Fully Responsive**: Works seamlessly on all devices (mobile, tablet, desktop)
- 🎨 **Modern Premium UI**: Clean interface with gradient designs and glassmorphism
- 🚀 **Real-time Updates**: Instant data synchronization
- ☁️ **Cloud-Ready**: MongoDB Atlas integration for production
- ⚡ **Instant Feedback**: Toast notifications and confirmation dialogs

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React 19 with Vite
- **State Management**: Zustand
- **Styling**: Tailwind CSS 3.4 (with custom premium design system)
- **HTTP Client**: Axios
- **Routing**: React Router DOM 7
- **Icons**: Lucide React
- **Charts**: Recharts
- **Date Handling**: date-fns

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Security**: Helmet, CORS
- **Development**: Morgan (logging), Nodemon

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- MongoDB (local or Atlas account)
- npm or yarn package manager

### 1. Install Dependencies
```bash
# Backend
cd server
npm install

# Frontend
cd client
npm install
```

### 2. Configure Environment Variables

**Backend** (`server/.env`):
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/employee-attendance
JWT_SECRET=your_secret_key_change_this
NODE_ENV=development
```

**Frontend** (`client/.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Seed Database
```bash
cd server
node src/scripts/seed.js
```

Creates 1 manager + 30 employees with 30 days of attendance history.

### 4. Run the Application

**Terminal 1 - Backend:**
```bash
cd server
npm start
# Server runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
# Frontend runs on http://localhost:5173
```

### 5. Login
- **Manager**: `manager@example.com` / `password123`
- **Employee**: `priya.patel@company.com` / `password123`

---

## 📁 Project Structure

```
AttendEase/
├── client/                     # React Frontend
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   │   ├── Layout.jsx     # Sidebar layout
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx      # Login (no public registration)
│   │   │   ├── EmployeeDashboard.jsx  # Employee dashboard
│   │   │   ├── ManagerDashboard.jsx   # Manager dashboard
│   │   │   ├── CreateEmployee.jsx     # Manager creates employees
│   │   │   ├── MyAttendance.jsx
│   │   │   ├── AllAttendance.jsx
│   │   │   ├── Reports.jsx
│   │   │   └── Profile.jsx
│   │   ├── services/
│   │   │   └── api.js         # Axios config
│   │   ├── store/
│   │   │   └── useAuthStore.js  # Zustand auth store
│   │   └── App.jsx
│   ├── tailwind.config.js     # Premium design system
│   └── package.json
│
├── server/                    # Node.js Backend
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── attendanceController.js
│   │   │   └── dashboardController.js
│   │   ├── middleware/
│   │   │   └── authMiddleware.js  # JWT + Manager role check
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── Attendance.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── attendanceRoutes.js
│   │   │   └── dashboardRoutes.js
│   │   ├── scripts/
│   │   │   └── seed.js        # Database seeding
│   │   └── index.js
│   └── package.json
│
├── DEPLOYMENT_GUIDE.md       # Deployment instructions
└── README.md                 # This file
```

---

## ⚡ Attendance Business Rules

### 1. Check-In Rules

#### On Time (Before 9:00 AM)
- ✅ Status: `present`
- Message: "You are on time!"

#### Late Arrival (9:00 AM - 12:59 PM)
- ⚠️ Status: `late`
- Shows: "You are late by X hours and Y minutes. Today will be considered as late arrival."
- Example: Check-in at 10:15 AM → "Late by 1 hour and 15 minutes"

#### After Deadline (1:00 PM or later)
- ❌ Blocked
- Status: `leave`
- Message: "Check-in not allowed after 1:00 PM. You will be marked as on leave for today."

#### Weekend Check-In
- 🚫 Blocked (Saturday/Sunday)
- Message: "Today is [Day], it's a day off. Check-in is not allowed on weekends."

### 2. Check-Out Rules

#### Work Hours < 4 Hours
- Status: `leave`
- Automatically marked even if checked in

#### Check-Out Before 5:00 PM
- Status: `half-day`
- Applies regardless of check-in time

#### Normal Check-Out (After 5:00 PM, > 4 hours)
- Status: Maintains check-in status (`present` or `late`)

### 3. Confirmation Modals

**Check-In Modal:**
- Real-time clock (updates every second)
- Current date and time display
- Color-coded status message (green/yellow/red)
- Exact lateness calculation
- Weekend detection
- Confirm/Cancel buttons

**Check-Out Modal:**
- Real-time clock display
- Warning message about work hours
- **Mandatory checkbox** confirmation
- Disabled button until checkbox is checked
- Confirm/Cancel buttons

---

## 🔐 Authentication & Authorization

### Manager-Only Employee Creation

❌ **No public registration** - Registration link removed from login page  
✅ **Managers create employees** - Only managers can create new accounts

**How It Works:**
1. Manager logs in
2. Clicks "Create Employee" in sidebar
3. Fills employee details:
   - Name, Email, Password
   - Employee ID, Department
4. System validates:
   - Email uniqueness
   - Employee ID uniqueness
   - All required fields
5. Creates account with `role: 'employee'`
6. Employee can now login with credentials

**Security:**
- Backend endpoint protected by `isManager` middleware
- Frontend route protected by role-based guard
- Created accounts are ALWAYS employees (managers cannot create other managers)

---

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "manager@example.com",
  "password": "password123"
}
```

Returns JWT token and user details.

#### Create Employee (Manager Only)
```http
POST /api/auth/create-employee
Authorization: Bearer {manager_token}
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john.doe@company.com",
  "password": "password123",
  "employeeId": "EMP099",
  "department": "Engineering"
}
```

Returns created employee details.

### Attendance

#### Check In
```http
POST /api/attendance/checkin
Authorization: Bearer {token}
```

Applies business rules (late check, 1 PM deadline, weekend check).

#### Check Out
```http
POST /api/attendance/checkout
Authorization: Bearer {token}
```

Applies business rules (4-hour minimum, 5 PM half-day).

#### Get My Attendance
```http
GET /api/attendance/my-attendance
Authorization: Bearer {token}
```

#### Get All Attendance (Manager)
```http
GET /api/attendance/all?status=late&department=Engineering
Authorization: Bearer {manager_token}
```

Supports filters: `status`, `department`, `startDate`, `endDate`

#### Export CSV Report (Manager)
```http
GET /api/attendance/export?status=present&department=HR
Authorization: Bearer {manager_token}
```

Downloads CSV file with filtered attendance data.

### Dashboard

#### Employee Stats
```http
GET /api/dashboard/employee
Authorization: Bearer {token}
```

Returns:
- Today's status
- Monthly stats (present, leave, late, half-day)
- Total hours worked
- Recent 7-day activity

#### Manager Stats
```http
GET /api/dashboard/manager
Authorization: Bearer {manager_token}
```

Returns:
- Total employees
- Today's attendance summary
- Department-wise breakdown
- Weekly trends

---

## 🌐 Deployment

See **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** for detailed deployment instructions.

### Quick MongoDB Atlas Setup

1. **Create Account**: https://www.mongodb.com/cloud/atlas/register
2. **Create Cluster**: Choose M0 Free tier
3. **Create User**: Database Access → Add user with read/write permissions
4. **Whitelist IP**: Network Access → Allow access (for testing: 0.0.0.0/0)
5. **Get Connection String**: Database → Connect → Connect your application
6. **Update .env**: 
   ```env
   MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/employee-attendance?retryWrites=true&w=majority
   ```
7. **Test**: `npm start` should show "MongoDB Connected"
8. **Seed**: `node src/scripts/seed.js`

### Deployment Options

| Platform | Best For | Free Tier |
|----------|----------|-----------|
| **Render** | Full-stack | ✅ Backend + Frontend |
| **Vercel** | Frontend only | ✅ Unlimited |
| **Railway** | Fast deployment | ✅ $5 credit/month |

**Recommended**: Render (backend) + Vercel (frontend)

---

## 🔑 Test Credentials

### Manager Account
```
Email: manager@example.com
Password: password123
```

**Can:**
- View all employee attendance
- Generate reports
- Create new employee accounts
- Export CSV data

### Employee Accounts (30 available)
```
Email: priya.patel@company.com
Password: password123

Email: rahul.sharma@company.com  
Password: password123

Email: amit.kumar@company.com
Password: password123
```

All seeded employees use password: `password123`

**Sample Departments:**
- Engineering
- HR
- Sales
- Marketing
- Finance
- Operations

---

## 🎨 UI/UX Features

### Premium Design System
- **Colors**: Modern gradient palette (Indigo → Blue → Cyan)
- **Components**: Glassmorphism effects with backdrop blur
- **Shadows**: Soft 8px blur shadows with color tints
- **Animations**: Smooth 300ms transitions everywhere
- **Typography**: Bold 800-weight headings, clean body text

### Responsive Design
- **Mobile (360-480px)**: Stacked cards, bottom navigation, floating action buttons
- **Tablet (768-1024px)**: Two-column layouts, condensed sidebar
- **Laptop (1366-1920px)**: Full dashboard, multi-column grids
- **Desktop (1920px+)**: Wide layouts, expanded components

### Micro-Interactions
- Hover effects on all buttons and cards
- Loading skeletons during data fetch
- Toast notifications for actions
- Confirmation modals with checkboxes
- Live clock display (updates every second)
- Pulse animations on status indicators

---

## 🛠 Development

### Backend Scripts
```bash
cd server

npm start        # Start server
npm run dev      # Start with nodemon (auto-reload)
```

### Frontend Scripts
```bash
cd client

npm run dev      # Development server (http://localhost:5173)
npm run build    # Production build
npm run preview  # Preview production build
```

### Database Seeding
```bash
cd server
node src/scripts/seed.js
```

Creates:
- 1 Manager
- 30 Employees (realistic Indian names)
- 30 days of attendance history
- Mix of statuses: 80% present, 10% late, 10% leave

---

## 🔒 Security Features

- ✅ Password hashing with bcryptjs (10 salt rounds)
- ✅ JWT authentication with expiry
- ✅ Protected API routes with middleware
- ✅ Role-based access control (Employee/Manager)
- ✅ CORS configuration
- ✅ Helmet security headers
- ✅ Environment variables for sensitive data
- ✅ Input validation on backend
- ✅ Manager-only endpoints protected
- ✅ Frontend route protection

---

## 📞 Support & Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| "Connection refused" | Check MongoDB is running/Atlas IP whitelist |
| "Authentication failed" | Verify password in connection string |
| "CORS error" | Check VITE_API_URL in client/.env |
| "Cannot find module" | Run `npm install` in both folders |
| Login not working | Check backend terminal for errors |
| 0 absent days displayed | Database seeded correctly? Run seed script |

### Getting Help
1. Check [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for deployment issues
2. Review API documentation above
3. Check browser console (F12) for frontend errors
4. Check server terminal for backend errors
5. Verify environment variables are set correctly

---

## 🎯 Future Enhancements

- [ ] Email notifications for attendance reminders
- [ ] Leave management system with approvals
- [ ] Bulk employee import via CSV
- [ ] Advanced analytics dashboard with charts
- [ ] Mobile app (React Native)
- [ ] Biometric authentication integration
- [ ] Shift management support
- [ ] Overtime tracking and calculations
- [ ] Holiday calendar integration
- [ ] Performance reviews integration

---

## 📄 License

This project is licensed under the MIT License.

---

**Made with ❤️ using React, Node.js, and MongoDB**

---

## 📌 Version History

**v2.0** (Current)
- ✨ Manager-only employee creation (no public registration)
- ✨ Check-in/check-out confirmation modals
- ✨ Real-time clock display
- ✨ Smart late arrival warnings (exact hours/minutes)
- ✨ Weekend detection and blocking
- ✨ Business rule validations (9 AM, 1 PM, 4 hours, 5 PM)
- ✨ Premium UI/UX redesign with glassmorphism
- ✨ Enhanced Tailwind configuration
- ✨ Settings page with password change
- ✨ Lottie animations for loading states
- 🐛 Fixed absent days dashboard display
- 🐛 Improved attendance status calculations

**v1.0**
- Initial release with basic attendance tracking
- Employee and manager dashboards
- CSV report export
- JWT authentication

