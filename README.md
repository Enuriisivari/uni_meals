# Uni Meals

A full-stack web application for managing university canteen orders and meal services. Students can browse canteens, view menus, place orders, and track their orders in real-time.

## 📁 Project Structure

```
uni_meals/
├── client/          # React frontend application
├── server/          # Node.js/Express backend application
├── .gitignore       
└── README.md        
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local or MongoDB Atlas)

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/Enuriisivari/uni_meals.git
cd uni_meals
```

#### 2. Setup Server

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:

```bash
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/uni_meals
```

Or use MongoDB Atlas:

```bash
PORT=5000
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/uni_meals?retryWrites=true&w=majority
```

Start the server:

```bash
npm run dev
```

The server will run on `http://localhost:5000`

#### 3. Setup Client

```bash
cd client
npm install
```

Start the development server:

```bash
npm run dev
```

The client will run on `http://localhost:5173`

## 📚 Project Features

### Client (Frontend)

- **Student Authentication**: Login and Sign Up
- **Home Page**: Browse available canteens
- **Canteen Menu**: View detailed menu for each canteen
- **Orders Management**: Place and manage food orders
- **Order Tracking**: Track order status in real-time
- **User Profile**: View and edit student profile
- **Password Management**: Change password and forgot password functionality

### Server (Backend)

- **Authentication**: User registration and login with JWT
- **Database**: MongoDB for data persistence
- **API Routes**: RESTful API endpoints for all operations
- **User Management**: Handle user profiles and authentication
- **Order Management**: Process and manage food orders

## 🔧 Technologies Used

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **CSS** - Styling

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **dotenv** - Environment variables
- **Nodemon** - Development server with auto-reload

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new student
- `POST /api/auth/login` - Login student
- `POST /api/auth/logout` - Logout student

### Additional endpoints can be found in `server/src/routes/`

## 🌳 Git Branches

- **main** - Production-ready code
- **feature/student-side** - Student-side feature development
- **app-setup** - Initial app setup
- **user-setup** - User authentication setup

## 💡 Development

### Running Both Client and Server

**Terminal 1 - Server:**
```bash
cd server
npm run dev
```

**Terminal 2 - Client:**
```bash
cd client
npm run dev
```

### Code Quality

**Server:**
- Linting: Check with ESLint in client folder
- Make sure to follow the existing code patterns

## 📦 Environment Variables

### Server (.env)
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/uni_meals
```

## 🐛 Troubleshooting

### MongoDB Connection Error
If you get `ECONNREFUSED 127.0.0.1:27017`:
1. Make sure MongoDB is running locally, OR
2. Use MongoDB Atlas connection string in `.env`

### Port Already in Use
If port 5000 is already in use:
- Change `PORT` in `.env`
- Update API base URL in client if needed

### Dependencies Issues
```bash
# Clear node_modules and reinstall
rm -r node_modules package-lock.json
npm install
```

## 📞 Contact & Support

For issues or questions, please create an issue in the GitHub repository.

## 📄 License

This project is part of the ITPM University Meals System.

---

**Happy Coding! 🎉**
