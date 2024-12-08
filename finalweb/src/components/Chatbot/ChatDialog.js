import React, { useState } from 'react';
import './ChatDialog.css'; // CSS riêng cho Chat Dialog
import axios from 'axios'; // Thêm axios để gọi API

const ChatDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! How can I help you?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false); // Để hiển thị trạng thái loading

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true); // Bắt đầu trạng thái loading

    try {
      const response = await axios.post('http://localhost:8000/api/chat', {
        messages: newMessages,
      });

      const aiResponse = response.data.data.choices[0].message.content;

      setMessages([...newMessages, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages([...newMessages, { role: 'assistant', content: 'API connection error.' }]);
    } finally {
      setLoading(false); // Kết thúc trạng thái loading
    }
  };
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage(); 
    }
  };

  return (
    <div className={`chat-dialog ${isOpen ? 'open' : ''}`}>
      <div className="chat-header" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? 'Chat with us' : 'Need Help?'}
      </div>
      {isOpen && (
        <div className="chat-body">
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.role}`}>
                <strong>{msg.role === 'user' ? 'You' : 'Bot'}:</strong> {msg.content}
              </div>
            ))}
            {loading && <p>Processing...</p>}
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatDialog;
