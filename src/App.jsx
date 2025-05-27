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
    } catch (error) {
      console.error("Error fetching response:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-[#1e1e1e] flex  items-center justify-between px-8 py-8">
        <div className="text-white/75">
          <h1 className="text-2xl font-bold ">MeghAI</h1>
        </div>
        <div className="text-white/75">
          <h1>Login</h1>
        </div>
      </div>
      <div className="min-h-screen bg-[#1e1e1e] text-white flex flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-semibold mb-6">What can I help with?</h1>
       

        <div className="mt-6 w-full max-w-xl space-y-4">
          {blogs.map((item, index) => (
            <div key={index} className="bg-[#2e2e2e] p-4 rounded-lg">
              <p className="font-semibold">Q: {item.question}</p>
              <p className="mt-2 text-gray-300">A: {item.answer}</p>
            </div>
          ))}
        </div>
         {loading && <p className="mt-4"><span className="loading loading-spinner loading-xs"></span></p>}

        <div className="bg-[#2e2e2e] w-full max-w-xl mt-8 rounded-xl flex items-center px-4 py-3">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                generateAnswer();
              }
            }}
            type="text"
            placeholder="Ask anything"
            className="flex-1 py-3 bg-transparent outline-none text-white placeholder-gray-400"
          />
        </div>
      </div>
    </>
  );
}

export default App;
