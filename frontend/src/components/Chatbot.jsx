import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, User, Bot, Send } from 'lucide-react';
import { api } from '../services/api';

const Chatbot = ({ productName }) => {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: `Xin chào! Tôi là trợ lý AI. Bạn muốn biết gì về sản phẩm "${productName}"?`,
    },
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef(null);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    try {
      const data = await api.askAI(productName, userMsg);
      setMessages((prev) => [...prev, { role: "bot", text: data.answer }]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Lỗi kết nối AI." },
      ]);
    }
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="glass-panel border-0 mt-4 overflow-hidden rounded-4">
      <div className="card-header bg-primary bg-opacity-10 border-0 py-3 px-4">
        <div className="d-flex align-items-center gap-2 text-primary">
          <MessageCircle size={20} />{" "}
          <span className="fw-bold">Trợ Lý Ảo MilkFamily</span>
        </div>
      </div>
      <div
        className="card-body bg-transparent px-4 py-3"
        style={{ height: "300px", overflowY: "auto" }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`d-flex mb-3 ${msg.role === "user"
                ? "justify-content-end"
                : "justify-content-start"
              }`}
          >
            <div
              className={`d-flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""
                }`}
              style={{ maxWidth: "80%" }}
            >
              <div
                className={`rounded-circle p-2 d-flex align-items-center justify-content-center flex-shrink-0 bg-white shadow-sm border`}
                style={{ width: 32, height: 32 }}
              >
                {msg.role === "user" ? <User size={16} className="text-secondary" /> : <Bot size={16} className="text-primary" />}
              </div>
              <div
                className={`p-3 rounded-4 shadow-sm ${msg.role === "user"
                    ? "bg-primary text-white rounded-tr-0"
                    : "bg-white text-dark border rounded-tl-0"
                  }`}
              >
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div className="card-footer bg-transparent p-3 border-top border-light">
        <div className="input-group">
          <input
            type="text"
            className="form-control border-0 bg-light rounded-pill ps-4"
            placeholder="Đặt câu hỏi..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            className="btn btn-primary rounded-pill ms-2 d-flex align-items-center justify-content-center"
            onClick={handleSend}
            style={{ width: 40, height: 40 }}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
