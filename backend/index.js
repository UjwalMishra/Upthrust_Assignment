const { GoogleGenerativeAI } = require("@google/generative-ai"); // Correct package name
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

const app = express();
app.use(express.json());

const allowedOrigin = process.env.FRONTEND_URL || "*";

const corsOptions = {
  origin: allowedOrigin,
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

console.log("FRONTEND_URL:", process.env.FRONTEND_URL);

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const aiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// 1. AI Agent Function
async function getAiResponse(userPrompt) {
  try {
    const result = await aiModel.generateContent({
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      generationConfig: {
        maxOutputTokens: 60, // Keep responses short - tweet-sized
        temperature: 0.7, // Adjust creativity
      },
    });
    const responseText = result.response.text();
    return responseText.trim();
  } catch (error) {
    console.error("Error calling Gemini :", error.message);
    throw new Error("Failed to get AI response.");
  }
}

// 2. Weather API (OpenWeatherMap)
async function getWeather(city = "Amritsar") {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API_KEY}&units=metric`
    );
    const data = response.data;
    console.log("weather app - ", data);

    return `${data.weather[0].main} in ${data.name}, ${data.main.temp}°C`;
  } catch (error) {
    console.error(
      "Error calling OpenWeatherMap API:",
      error.response?.data || error.message
    );
    throw new Error("Failed to get weather data."); // Throw error to be caught by workflow
  }
}

// 3. News API (NewsAPI.org)
async function getNews() {
  try {
    const response = await axios.get(
      `https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.NEWS_API_KEY}`
    );
    const articles = response.data.articles.slice(0, 3);
    if (articles.length === 0) return "No top headlines found.";
    return articles.map((article) => article.title).join(" | ");
  } catch (err) {
    console.error("Error calling NewsAPI:", err.response?.data || err.message);
    throw new Error("Failed to get news headlines.");
  }
}

// 4. GitHub API (Trending Repos)
async function getTrendingRepo() {
  try {
    const response = await axios.get(
      "https://api.github.com/search/repositories",
      {
        params: {
          q: "stars:>10000",
          sort: "stars",
          order: "desc",
          per_page: 3,
        },
      }
    );

    const repos = response.data.items;
    if (repos.length === 0) return "No highly starred repos found.";
    return repos
      .map((repo) => `${repo.full_name} (${repo.stargazers_count} stars)`)
      .join(", ");
  } catch (err) {
    console.error(
      "Error calling GitHub API:",
      err.response?.data || err.message
    );
    throw new Error("Failed to get trending repositories.");
  }
}

//  Workflow Endpoint
app.post("/run-workflow", async (req, res) => {
  const { prompt, action } = req.body;

  if (!prompt || !action) {
    return res.status(400).json({ error: "Prompt and action are required." });
  }

  let ai_response = "";
  let api_response = "";
  let final_result = "";

  try {
    switch (action) {
      case "weather":
        api_response = await getWeather();
        ai_response = await getAiResponse(
          `${prompt}\n\nWeather data: ${api_response}\n\nWrite a short, tweet-style summary of this. Do NOT include hashtags. Keep it crisp.`
        );

        final_result = `${ai_response} (Data: ${api_response}) #${action}`;

        break;

      case "news":
        api_response = await getNews();
        ai_response = await getAiResponse(
          `${prompt}\n\nTop news headlines: ${api_response}\n\nWrite a concise tweet-style summary highlighting the key updates. Do NOT include hashtags. Keep it crisp.`
        );
        final_result = `${ai_response} (Headlines: ${api_response}) #${action}`;
        break;

      case "github":
        api_response = await getTrendingRepo();
        ai_response = await getAiResponse(
          `${prompt}\n\nTrending GitHub repos: ${api_response}\n\nWrite a catchy tweet-style update about these repos. Do NOT include hashtags. Keep it crisp.`
        );
        final_result = `${ai_response} (Repos: ${api_response}) #${action}`;
        break;

      default:
        return res.status(400).json({ error: "Invalid action specified." });
    }

    return res.status(200).json({
      ai_response,
      api_response,
      final_result,
    });
  } catch (err) {
    console.error("Workflow execution error:", err);
    return res.status(500).json({
      success: false,
      msg:
        err.message ||
        "An internal server error occurred during workflow execution.",
    });
  }
});

// Server Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server connected on port ${PORT}`);
});
