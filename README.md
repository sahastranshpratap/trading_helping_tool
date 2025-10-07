# Trading Journal Web App

A modern web application for tracking and analyzing trading activities, built with React and Flask.

## 🚀 Development Setup

This project has been configured for development without authentication or database dependencies.

### Prerequisites

- Node.js (v16 or higher)
- Python (v3.8 or higher)
- npm or yarn

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The frontend will be available at `http://localhost:3000`

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Start the Flask server:
   ```bash
   python app.py
   ```

The backend API will be available at `http://localhost:5000`

## 🔧 Development Features

### Authentication
- **Development Mode**: No authentication required
- Users are automatically logged in as "Developer"
- All routes are publicly accessible

### Data Storage
- **Mock Data**: Uses mock data for development
- No database setup required
- Data persists only during the session

### API Endpoints
- `/api/trades` - Trade management
- `/api/analytics` - Analytics and performance metrics
- `/api/gemini` - AI-powered suggestions

## 📁 Project Structure

```
trading_journal_web_app/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── services/         # API services (mock data)
│   │   └── pages/           # Page components
│   └── package.json
├── backend/                  # Flask backend
│   ├── routes/              # API routes
│   ├── services/            # Business logic
│   ├── api/                 # External API integrations
│   └── app.py              # Main Flask app
└── README.md
```

## 🎯 Key Features

- **Dashboard**: Overview of trading performance
- **Analytics**: Detailed performance metrics and charts
- **Trade Journal**: Record and track individual trades
- **AI Suggestions**: Get trading insights using Gemini AI
- **Calendar View**: Visualize trading activity over time
- **Responsive Design**: Works on desktop and mobile

## 🔄 Switching to Production

To enable authentication and database functionality:

1. **Frontend**: Set `useMockData: false` in `frontend/src/services/api.js`
2. **Backend**: Add database configuration in `backend/config.py`
3. **Authentication**: Implement proper auth routes and middleware

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License. 