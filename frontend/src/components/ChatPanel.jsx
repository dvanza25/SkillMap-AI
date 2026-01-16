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
    <div className="h-full flex flex-col p-4">
      <h2 className="text-lg font-semibold mb-2">AI Tutor</h2>

      {selectedNodeId && (
        <div className="text-xs text-gray-500 mb-2">
          Context: <span className="font-semibold">{selectedNodeId}</span>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-3">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded ${msg.role === "user"
              ? "bg-blue-100 text-right"
              : "bg-gray-100"
              }`}
          >
            <div>{msg.content}</div>

            {/* Sources (safe rendering) */}
            {msg.role === "assistant" && msg.sources.length > 0 && (
              <div className="mt-2 text-xs text-gray-600">
                <div className="font-semibold">Sources:</div>
                <ul className="list-disc list-inside">
                  {msg.sources.map((src, i) => (
                    <li key={i}>{src}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="text-sm text-gray-500">Thinking...</div>
        )}
      </div>

      {!selectedNodeId && (
        <div className="text-sm text-yellow-600 mb-2">
          Select a roadmap node to ask contextual questions.
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="flex-1 border rounded px-3 py-2"
          placeholder="Ask about your roadmap..."
        />
        <button
          onClick={sendMessage}
          disabled={!selectedNodeId || loading}
          className={`px-4 py-2 rounded text-white ${!selectedNodeId
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600"
            }`}
        >
          Send
        </button>
      </div>
    </div>
  );
}
