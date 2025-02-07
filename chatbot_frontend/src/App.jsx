import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
    const [query, setQuery] = useState("");
    const [response, setResponse] = useState("");
    const [history, setHistory] = useState([]); // Store previous responses

    const handleSearch = async (e) => {
      e.preventDefault();
      if (!query.trim()) return; // Prevent empty submissions
  
      try {
          const result = await axios.post(
              "http://localhost:5298/api/chat/send",
              {
                  model: "llama3.2:1b",
                  messages: [{ role: "user", content: query }],
                  stream: false,
              },
              { headers: { "Content-Type": "application/json" } }
          );
  
          const parsedResponse = JSON.parse(result.data.response);
          const botResponse = parsedResponse.message.content;
  
          setResponse(botResponse);
  
          // Cache only the last three searches
          setHistory((prevHistory) => {
              const updatedHistory = [...prevHistory, { question: query, answer: botResponse }];
              return updatedHistory.slice(-3); // Keep only the last 3 items
          });
  
      } catch (error) {
          console.error("Error fetching results:", error);
          setResponse("Error communicating with the chatbot.");
      }
  };

    return (
        <div className="google-container">
            <h1 className="google-logo">Jarvis</h1>
            <form className="search-box" onSubmit={handleSearch}>
                <input
                    type="text"
                    className="search-input"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask me anything..."
                    onKeyDown={(e) => e.key === "Enter" && handleSearch(e)} // Handle Enter key
                />
                <button type="submit" className="search-button">Search</button>
            </form>

            {/* Current Response */}
            {response && (
                <div className="search-results">
                    <h3>Latest Result:</h3>
                    <p className="result-text">{response}</p>
                </div>
            )}

            {/* Search History */}
            {history.length > 0 && (
                <div className="search-history">
                    <h3>Previous Searches:</h3>
                    <ul>
                        {history.map((entry, index) => (
                            <li key={index} className="history-item">
                                <strong>Q:</strong> {entry.question}
                                <br />
                                <strong>A:</strong> {entry.answer}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default App;
