import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./assets/css/chatbot.css";

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const toggleOpen = () => setOpen(!open);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, loading, isTyping]);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedFile) || loading) return;

    // Create user message with text and/or image
    const userMessage = { 
      type: "user", 
      content: input.trim() || "",
      image: selectedFile ? previewUrl : null,
      fileName: selectedFile ? selectedFile.name : null
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setIsTyping(true);

    // Clear selected file after sending
    if (selectedFile) {
      removeSelectedFile();
    }

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('text', userMessage.content);
      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      const response = await axios.post('https://bike-service-management-3.onrender.com/api/chat', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Simulate typing delay for better UX
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { type: "bot", content: response.data.answer || "I'm here to help with your bike service needs!" },
        ]);
        setLoading(false);
        setIsTyping(false);
      }, 1000);

    } catch (err) {
      console.error("Chat error:", err);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            type: "bot",
            content: "I'm having trouble connecting right now. Please try again or call us at +91 94437-74973 for immediate assistance.",
          },
        ]);
        setLoading(false);
        setIsTyping(false);
      }, 1000);
    }
  };

  return (
    <div className="chatbot-container">
      {/* Chat Toggle Button */}
      <button
        onClick={toggleOpen}
        className={`chatbot-toggle ${open ? 'open' : ''}`}
        aria-label={open ? "Close chat" : "Open chat"}
      >
        <div className="chatbot-icon">
          {open ? '✕' : '💬'}
        </div>
        {!open && <div className="chatbot-pulse"></div>}
      </button>

      {/* Chat Window */}
      {open && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar">🤖</div>
              <div className="chatbot-header-text">
                <div className="chatbot-title">Bike Service Assistant</div>
                <div className="chatbot-status">
                  <span className="status-dot"></span>
                  Online
                </div>
              </div>
            </div>
            <button
              onClick={toggleOpen}
              className="chatbot-close"
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="chatbot-messages">
            {messages.length === 0 && (
              <div className="chatbot-welcome">
                <div className="welcome-icon">🚴‍♂️</div>
                <div className="welcome-title">Welcome to Bike Service!</div>
                <div className="welcome-text">
                  Hi! I'm your AI assistant. I can help you with:
                </div>
                <div className="welcome-features">
                  <div className="feature-item">📅 Book services</div>
                  <div className="feature-item">🔍 Check service status</div>
                  <div className="feature-item">❓ Answer questions</div>
                  <div className="feature-item">🛠️ Technical support</div>
                </div>
                <div className="welcome-text">How can I help you today?</div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`message ${msg.type === "user" ? "user-message" : "bot-message"}`}
              >
                {msg.type === "bot" && (
                  <div className="message-avatar">🤖</div>
                )}
                <div className="message-content">
                  {msg.image && (
                    <div className="message-image-container">
                      <img 
                        src={msg.image} 
                        alt={msg.fileName || "Uploaded image"} 
                        className="message-image"
                      />
                      {msg.fileName && (
                        <div className="image-filename">{msg.fileName}</div>
                      )}
                    </div>
                  )}
                  {msg.content && (
                    <div className="message-text">{msg.content}</div>
                  )}
                </div>
                {msg.type === "user" && (
                  <div className="message-avatar user-avatar">👤</div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="message bot-message">
                <div className="message-avatar">🤖</div>
                <div className="message-content typing">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <span className="typing-text">Mechanic is typing...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="chatbot-input">
            {previewUrl && (
              <div className="image-preview">
                <img src={previewUrl} alt="Preview" className="preview-image" />
                <button 
                  onClick={removeSelectedFile}
                  className="remove-image-btn"
                  aria-label="Remove image"
                >
                  ✕
                </button>
              </div>
            )}
            <div className="input-container">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about bike services..."
                className="chatbot-text-input"
                onKeyDown={(e) => e.key === "Enter" && !loading && handleSend()}
                disabled={loading}
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="chatbot-attach-btn"
                aria-label="Attach image"
                disabled={loading}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66L9.64 16.2a2 2 0 0 1-2.83-2.83l8.49-8.49" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button
                onClick={handleSend}
                disabled={loading || (!input.trim() && !selectedFile)}
                className="chatbot-send-btn"
                aria-label="Send message"
              >
                {loading ? (
                  <div className="loading-spinner"></div>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            </div>
            <div className="input-footer">
              <span className="input-hint">Press Enter to send • Click 📎 to attach image</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
