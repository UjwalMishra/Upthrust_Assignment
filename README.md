# Upthrust Assignment — Mini Workflow Automation

## 🎯 Objective
A simple **full-stack workflow automation app** where users can define and run a 2-step workflow powered by an **AI Agent** and a third-party API (Weather, News, or GitHub).

---

## 🛠️ Tech Stack
-   **Backend**: `Node.js`, `Express.js`
-   **Frontend**: `React.js`, `Tailwind CSS`
-   **APIs**:
    -   Gemini (Google Generative AI)
    -   OpenWeather API
    -   News API (`newsapi.org`)
    -   GitHub API (trending repos)
-   **Deployment**: Render (Backend) & Vercel (Frontend)

---

## 🚀 Features
1.  **AI Agent Integration**
    -   Takes a user prompt.
    -   Uses the Gemini API to generate short, tweet-style responses.

2.  **Third-Party APIs**
    -   **Weather:** Fetches the current weather for a specified city.
    -   **News:** Retrieves top headlines from NewsAPI.
    -   **GitHub:** Gets a list of trending repositories.

3.  **Frontend UI**
    -   An input field for the user's prompt.
    -   A dropdown menu to select the API (Weather / News / GitHub).
    -   A display area for the final combined output.

---

## ⚙️ Setup Instructions

### Backend Setup

1.  **Clone the Repository**
    ```bash
    git clone [https://github.com/](https://github.com/)<your-username>/Upthrust_Assignment.git
    cd Upthrust_Assignment/backend
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Create `.env` file**
    Create a `.env` file in the `backend` directory and add the following variables:
    ```ini
    PORT=3000
    FRONTEND_URL=http://localhost:5173
    GEMINI_API_KEY=your_gemini_api_key
    WEATHER_API_KEY=your_openweather_api_key
    NEWS_API_KEY=your_newsapi_key
    ```

4.  **Run the Backend Server**
    ```bash
    npm run dev
    ```

### Frontend Setup

1.  **Navigate to the Frontend Directory**
    ```bash
    cd ../frontend
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Set Backend URL**
    In your frontend code (e.g., in a config file or directly where you make API calls), set the backend URL.
    ```javascript
    const BACKEND_URL = "http://localhost:3000"; // Or your deployed backend URL
    ```

4.  **Run the Frontend App**
    ```bash
    npm run dev
    ```

---

## 🧪 Testing
You can test the API endpoints using a tool like Postman or `curl` with the following JSON bodies sent to your backend server (e.g., `http://localhost:3000/api/v1/run`).

**Example 1: Weather Tweet**
{
  "prompt": "Write a tweet about today’s weather",
  "action": "weather"
}

**Example 2: News Tweet**
{
  "prompt": "Write a tweet about today's top headlines",
  "action": "news"
}

**Example 3: GitHub Tweet**
{
  "prompt": "Write a tweet about today’s weather",
  "action": "weather"
}
