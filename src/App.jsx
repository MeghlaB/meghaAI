import { useState } from "react";
import axios from "axios";
import "./App.css";

const api_key = import.meta.env.VITE_GEMINI_KEY;

function App() {
  const [question, setQuestion] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const generateAnswer = async () => {
    if (!question.trim()) return;

    setLoading(true);
    try {
      const res = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${api_key}`,
        method: "POST",
        data: {
          contents: [
            {
              parts: [{ text: question }],
            },
          ],
        },
      });

      const aiText =
        res.data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No answer found.";

      setBlogs((prev) => [...prev, { question, answer: aiText }]);
      setQuestion("");
    } catch (error) {
      console.error("Error fetching response:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-md border-b border-gray-700 flex items-center justify-between px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">MeghAI</h1>
        </div>
        <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors">
          Sign In
        </button>
      </header>

     
      <main className="container mx-auto px-4 py-8 max-w-3xl">
     
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-300 to-purple-400 bg-clip-text text-transparent">
            How can I assist you today?
          </h1>
          <p className="text-gray-400 max-w-lg mx-auto">
            Ask anything and get intelligent responses powered by Gemini AI.
          </p>
        </section>

        {/* Chat Area */}
        <div className="space-y-6 mb-8">
          {blogs.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-300">No conversations yet</h3>
              <p className="text-gray-500 mt-2">Start by asking your first question below</p>
            </div>
          )}

          {blogs.map((item, index) => (
            <div key={index} className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 bg-gray-700 w-8 h-8 rounded-full flex items-center justify-center mt-1">
                  <span className="text-sm">👤</span>
                </div>
                <div className="bg-gray-800/50 px-4 py-3 rounded-lg max-w-[85%]">
                  <p className="font-medium">{item.question}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 bg-indigo-500 w-8 h-8 rounded-full flex items-center justify-center mt-1">
                  <span className="text-sm">AI</span>
                </div>
                <div className="bg-gray-800 px-4 py-3 rounded-lg max-w-[85%]">
                  <p className="text-gray-300 whitespace-pre-line">{item.answer}</p>
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 bg-indigo-500 w-8 h-8 rounded-full flex items-center justify-center mt-1">
                <span className="text-sm">AI</span>
              </div>
              <div className="bg-gray-800 px-4 py-3 rounded-lg max-w-[85%]">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            </div>
          )}
        </div>

      
        <div className="sticky bottom-6 bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-1 shadow-lg">
          <div className="flex items-center">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  generateAnswer();
                }
              }}
              type="text"
              placeholder="Ask MeghAI anything..."
              className="flex-1 bg-transparent outline-none text-white placeholder-gray-500 px-4 py-3"
              disabled={loading}
            />
            <button
              onClick={generateAnswer}
              disabled={loading || !question.trim()}
              className={`p-2 rounded-lg mr-1 ${loading || !question.trim() ? 'text-gray-500' : 'text-indigo-400 hover:bg-gray-700'}`}
            >
              {loading ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 animate-spin" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 px-4 pb-1">
            MeghAI may produce inaccurate information. Consider verifying important information.
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;