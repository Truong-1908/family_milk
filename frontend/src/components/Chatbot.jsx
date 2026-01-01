import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, User, Bot, Send, X, MoreHorizontal } from 'lucide-react';
import { api } from '../services/api';

const Chatbot = ({ productName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: productName
        ? `Xin chào! Tôi là trợ lý AI. Bạn muốn biết gì về sản phẩm "${productName}"?`
        : `Xin chào! Tôi là trợ lý ảo MilkFamily. Tôi có thể giúp gì cho bạn?`,
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
        { role: "bot", text: "Lỗi kết nối AI. Vui lòng thử lại sau." },
      ]);
    }
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  // Nếu có productName -> Hiển thị Inline (như cũ)
  if (productName) {
    return (
      <div className="glass-panel border-0 mt-4 overflow-hidden rounded-4">
        <div className="card-header bg-primary bg-opacity-10 border-0 py-3 px-4">
          <div className="d-flex align-items-center gap-2 text-primary">
            <MessageCircle size={20} />{" "}
            <span className="fw-bold">Trợ Lý Ảo MilkFamily</span>
          </div>
        </div>
        <div className="card-body bg-transparent px-4 py-3" style={{ height: "300px", overflowY: "auto" }}>
          <MessageList messages={messages} endRef={endRef} />
        </div>
        <InputArea input={input} setInput={setInput} handleSend={handleSend} />
      </div>
    );
  }

  // Nếu không có productName -> Hiển thị dạng Floating (Nút tròn ở góc)
  return (
    <>
      {!isOpen && (
        <button
          className="btn btn-primary btn-lg rounded-circle shadow-lg position-fixed bottom-0 end-0 m-4 d-flex align-items-center justify-content-center border-0 animate-bounce p-3"
          style={{ width: "64px", height: "64px", zIndex: 1050, background: "linear-gradient(45deg, #0d6efd, #0dcaf0)" }}
          onClick={() => setIsOpen(true)}
        >
          <MessageCircle size={32} color="white" />
        </button>
      )}

      {isOpen && (
        <div
          className="card position-fixed bottom-0 end-0 m-4 shadow-lg border-0 rounded-4 overflow-hidden animate-in"
          style={{ width: "380px", height: "500px", zIndex: 1050, backgroundColor: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)" }}
        >
          <div className="card-header bg-primary text-white border-0 py-3 px-4 d-flex align-items-center justify-content-between"
            style={{ background: "linear-gradient(45deg, #0d6efd, #0dcaf0)" }}>
            <div className="d-flex align-items-center gap-2">
              <Bot size={24} />
              <span className="fw-bold fs-5">Trợ Lý MilkFamily</span>
            </div>
            <button className="btn btn-sm btn-light bg-opacity-25 border-0 text-white rounded-circle p-1" onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <div className="card-body px-3 py-3 bg-light bg-opacity-25" style={{ height: "380px", overflowY: "auto" }}>
            <MessageList messages={messages} endRef={endRef} />
          </div>

          <div className="card-footer bg-white border-top p-3">
            <InputArea input={input} setInput={setInput} handleSend={handleSend} />
          </div>
        </div>
      )}
    </>
  );
};

const MessageList = ({ messages, endRef }) => (
  <>
    {messages.map((msg, index) => (
      <div key={index} className={`d-flex mb-3 ${msg.role === "user" ? "justify-content-end" : "justify-content-start"}`}>
        <div className={`d-flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`} style={{ maxWidth: "85%" }}>
          <div className={`rounded-circle p-2 d-flex align-items-center justify-content-center flex-shrink-0 shadow-sm border ${msg.role === "bot" ? "bg-white" : "bg-primary"}`} style={{ width: 32, height: 32 }}>
            {msg.role === "user" ? <User size={16} className="text-white" /> : <Bot size={16} className="text-primary" />}
          </div>
          <div className={`p-3 rounded-4 shadow-sm ${msg.role === "user" ? "bg-primary text-white rounded-tr-0" : "bg-white text-dark border rounded-tl-0"}`}>
            {msg.text}
          </div>
        </div>
      </div>
    ))}
    <div ref={endRef} />
  </>
);

const InputArea = ({ input, setInput, handleSend }) => (
  <div className="input-group">
    <input
      type="text"
      className="form-control border-0 bg-light rounded-pill ps-4"
      placeholder="Hỏi gì đó..."
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyPress={(e) => e.key === "Enter" && handleSend()}
    />
    <button
      className="btn btn-primary rounded-pill ms-2 d-flex align-items-center justify-content-center shadow-sm"
      onClick={handleSend}
      style={{ width: 40, height: 40 }}
    >
      <Send size={18} />
    </button>
  </div>
);

export default Chatbot;
