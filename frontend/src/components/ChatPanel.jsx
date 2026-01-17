import { useState } from "react";
import api from "../utils/axios";

export default function ChatPanel({ selectedNodeId }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!question.trim()) return;

    if (!selectedNodeId) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Please select a roadmap node first so I can answer in context.",
          sources: [],
        },
      ]);
      return;
    }

    const userMessage = {
      role: "user",
      content: question,
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);

    try {
      const res = await api.post("ai/chat/", {
        message: userMessage.content,
        node_id: selectedNodeId,
      });

      const aiMessage = {
        role: "assistant",
        content: res.data.answer,
        sources: res.data.sources || [],
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, something went wrong.",
          sources: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">🤖</span>
          <h2 className="text-xl font-bold">AI Tutor</h2>
        </div>
        <p className="text-blue-100 text-sm">Powered by Gemini AI</p>
      </div>

      {/* Context Indicator */}
      {selectedNodeId ? (
        <div className="bg-green-50 border-b border-green-200 px-6 py-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-lg">✓</span>
            <div>
              <p className="text-gray-600 text-xs font-medium">LEARNING CONTEXT</p>
              <p className="text-green-700 font-semibold">{selectedNodeId}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-lg">💡</span>
            <p className="text-amber-800">
              <span className="font-semibold">Tip:</span> Select a roadmap node first to ask contextual questions
            </p>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center">
            <div>
              <span className="text-5xl block mb-3">👋</span>
              <p className="text-gray-600 font-medium">Welcome to your AI Tutor!</p>
              <p className="text-gray-500 text-sm mt-2">
                Select a course and ask any questions to get personalized help
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs lg:max-w-sm xl:max-w-md px-4 py-3 rounded-xl ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-br-none shadow-md"
                    : "bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm"
                }`}
              >
                <div className="text-sm leading-relaxed">{msg.content}</div>

                {/* Sources */}
                {msg.role === "assistant" && msg.sources.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-300">
                    <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                      <span>📚</span> Sources
                    </p>
                    <ul className="space-y-1">
                      {msg.sources.map((src, i) => (
                        <li
                          key={i}
                          className="text-xs text-gray-600 bg-gray-50 rounded px-2 py-1 border-l-2 border-blue-400"
                        >
                          {src}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 border border-gray-200 px-4 py-3 rounded-xl rounded-bl-none shadow-sm flex items-center gap-2">
              <span className="text-lg animate-pulse">🤔</span>
              <span className="text-sm text-gray-600">AI Tutor is thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white p-6 shadow-xl">
        <div className="flex gap-3">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition duration-200 text-sm placeholder-gray-400"
            placeholder={selectedNodeId ? "Ask about this topic..." : "Select a course first..."}
            disabled={!selectedNodeId}
          />
          <button
            onClick={sendMessage}
            disabled={!selectedNodeId || loading || !question.trim()}
            className={`px-6 py-3 rounded-lg font-semibold transition duration-200 transform flex items-center gap-2 ${
              !selectedNodeId || loading || !question.trim()
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 active:scale-95 shadow-md"
            }`}
          >
            <span>Send</span>
            <span>📤</span>
          </button>
        </div>
      </div>
    </div>
  );
}
