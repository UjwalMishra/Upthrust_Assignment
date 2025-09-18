import { useState } from "react";
import axios from "axios";

function App() {
  const [prompt, setPrompt] = useState("");
  const [action, setAction] = useState("weather");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  async function getRes() {
    if (!prompt.trim()) {
      setError("Please enter a prompt.");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);

    try {
      const res = await axios.post(`${BACKEND_URL}/run-workflow`, {
        prompt,
        action,
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Check backend logs.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900">UPTHRUST</h1>
          <p className="text-gray-500 text-sm mt-2">Assignment Dashboard</p>
        </div>

        {/* Input Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter your prompt
          </label>
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            type="text"
            placeholder="Write a tweet about today's weather..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>

        {/* Action Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select action
          </label>
          <select
            value={action}
            onChange={(e) => setAction(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="weather">🌤 Weather</option>
            <option value="news">📰 News</option>
            <option value="github">💻 GitHub</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="mb-6">
          <button
            onClick={getRes}
            disabled={loading || !prompt.trim()}
            className={`w-full py-3 px-6 rounded-md font-medium transition-all duration-200 ${
              loading || !prompt.trim()
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-500"
            }`}
          >
            {loading ? "Processing..." : "Send Request"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 rounded-md border border-red-200 bg-red-50 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="border border-gray-200 rounded-lg p-6 space-y-6 bg-gray-50">
            <div>
              <h4 className="text-sm font-medium text-gray-700 uppercase mb-1">
                AI Response
              </h4>
              <p className="text-gray-900">{result.ai_response}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 uppercase mb-1">
                API Response
              </h4>
              <p className="text-gray-900">{result.api_response}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 uppercase mb-1">
                Final Result
              </h4>
              <p className="text-gray-900 font-medium">{result.final_result}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
