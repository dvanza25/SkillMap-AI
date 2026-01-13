import { useState } from "react";
import { api } from "../api/client";

export function AiChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.post("/ai/chat/", { question: input });
      const aiMsg = { role: "ai", text: res.data.answer };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error("Error:", err);
      let errorText = "Sorry, I encountered an error processing your question.";
      
      if (err.response?.data?.error) {
        errorText = err.response.data.error;
      } else if (err.response?.status === 500) {
        const errorType = err.response?.data?.type;
        if (errorType === "missing_api_key") {
          errorText = "⚠️ OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables.";
        } else if (errorType === "missing_knowledge_base") {
          errorText = "⚠️ Knowledge base not initialized. Please run the data ingestion script first.";
        } else if (errorType === "import_error") {
          errorText = "⚠️ LangChain modules not properly installed. Please check requirements.txt";
        }
      }
      
      const errorMsg = {
        role: "ai",
        text: errorText,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 border-b">
        <h3 className="text-lg font-bold">🤖 AI Tutor</h3>
        <p className="text-sm opacity-90">Ask me anything about your learning path</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <p className="text-lg font-semibold mb-2">👋 Welcome!</p>
              <p className="text-sm">Start a conversation with your AI Tutor</p>
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                m.role === "user"
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-gray-200 text-gray-900 rounded-bl-none"
              }`}
            >
              <p className="text-sm">{m.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg rounded-bl-none">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="bg-white border-t p-4 space-y-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
          className="w-full border border-gray-300 p-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          placeholder="Type your question... (Press Enter to send)"
          rows="3"
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-semibold transition"
        >
          {loading ? "⏳ Thinking..." : "Send Message"}
        </button>
      </div>
    </div>
  );
}
