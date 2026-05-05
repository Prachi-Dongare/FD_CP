# Agri-AI 🌾🤖

Agri-AI is a state-of-the-art agricultural platform designed to bridge the gap between farmers and expert knowledge using Artificial Intelligence. It provides real-time crop advice, weather insights, and a direct line to agricultural experts.

## 🚀 Features

- **AI-Powered Chatbot**: Get instant answers to farming queries using Google's Gemini AI.
- **Multilingual Support**: Fully localized interface to support farmers in their native languages.
- **Expert Dashboard**: Dedicated space for agricultural experts to answer escalated queries and publish educational blogs.
- **Farmer Dashboard**: Personalized dashboard for farmers to track their queries, view expert responses, and read agricultural blogs.
- **Real-time Escalation**: Seamlessly escalate complex AI queries to human experts.
- **Data Visualization**: Insightful charts and metrics for crop health and market trends.

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, Framer Motion, Recharts, Lucide React.
- **Backend**: Node.js, Express.js.
- **Database**: SQLite3 (File-based).
- **AI Integration**: Google Gemini API.

---

## 🏃‍♂️ How to Run the Project

Follow these steps to set up the project locally.

### 1. Clone the Repository
```bash
git clone https://github.com/tanishkadonde23/FD-CP.git
cd agri_ai
```

### 2. Backend Setup
The backend handles user authentication, expert escalations, and blogs.

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create/Update .env file in the backend folder
# PORT=5001

# Start the backend server
node server.js
```
The server will run at `http://localhost:5001`.

### 3. Frontend Setup
The frontend provides the interactive UI for farmers and experts.

```bash
# Navigate back to the root directory
cd ..

# Install dependencies
npm install

# Create/Update .env file in the root folder
# VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Start the frontend development server
npm run dev
```
The application will be available at `http://localhost:5173`.

---

## 🔑 Environment Variables

### Frontend (`.env`)
Create a `.env` file in the root directory and add your Gemini API key:
```env
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

### Backend (`backend/.env`)
Create a `.env` file in the `backend` directory:
```env
PORT=5001
```

---

## 📂 Project Structure

```text
agri_ai/
├── backend/            # Express server & SQLite database
│   ├── server.js       # Main server logic
│   └── database.sqlite # Local database file
├── src/                # React frontend source
│   ├── components/     # Reusable UI components
│   ├── pages/          # Main page views (Farmer/Expert Dashboards)
│   ├── context/        # Language and Auth contexts
│   └── App.jsx         # Main application entry
├── public/             # Static assets
└── package.json        # Frontend dependencies
```

## 🤝 Contributing
Feel free to fork this project and submit pull requests for any improvements or bug fixes.

## 📄 License
This project is licensed under the ISC License.
