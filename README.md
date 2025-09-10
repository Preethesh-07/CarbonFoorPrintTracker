# Carbon Footprint Tracker

A full-stack web application for tracking and reducing your carbon footprint. This application allows users to log their daily activities related to electricity, water, gas, waste, and transportation usage, and provides visualizations and tips to help reduce their environmental impact.

## Features

- **User Authentication**: Secure registration and login system
- **Activity Logging**: Track daily resource consumption
- **Carbon Calculation**: Automatic CO₂ equivalent calculations
- **Data Visualization**: Charts and graphs to visualize your carbon footprint
- **Personalized Tips**: Recommendations based on your usage patterns
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication

### Frontend
- React
- React Router
- Chart.js
- Axios

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/carbon-footprint-tracker.git
   cd carbon-footprint-tracker
   ```

2. Install backend dependencies
   ```
   cd backend
   npm install
   ```

3. Configure environment variables
   - Create a `.env` file in the backend directory with the following variables:
     ```
     MONGO_URI=mongodb://localhost:27017/carbon-footprint-tracker
     JWT_SECRET=your_jwt_secret
     JWT_EXPIRE=30d
     NODE_ENV=development
     PORT=5000
     ```

4. Install frontend dependencies
   ```
   cd ../frontend
   npm install
   ```

### Running the Application

1. Start the backend server
   ```
   cd backend
   npm run server
   ```

2. Start the frontend development server
   ```
   cd frontend
   npm start
   ```

3. Access the application at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/user` - Get current user

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user profile
- `DELETE /api/users/:id` - Delete user account

### Activities
- `POST /api/activities` - Create a new activity log
- `GET /api/activities` - Get all activities for current user
- `GET /api/activities/:id` - Get activity by ID
- `PUT /api/activities/:id` - Update an activity
- `DELETE /api/activities/:id` - Delete an activity
- `GET /api/activities/summary` - Get activity summary
- `GET /api/activities/summary/daily` - Get daily summary
- `GET /api/activities/summary/weekly` - Get weekly summary
- `GET /api/activities/summary/monthly` - Get monthly summary

## License

MIT