import React, { useState } from 'react';

function Chatbot() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! How can I help you?' }
  ]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);

    try {
      const res = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      const botMessage = { sender: 'bot', text: data.response || 'Sorry, no reply from server.' };
      // const botMessage = { sender: 'bot', text: data.reply || 'Sorry, no reply from server.' };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Fetch error:', error);
      setMessages(prev => [...prev, { sender: 'bot', text: 'Could not get reply.' }]);
    }

    setInput('');
  };

 return (
    <div className="chatcontainer">
      <div className="messagesBox">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`message ${msg.sender === 'user' ? 'messageUser' : 'messageBot'}`}
          >
            <span className={msg.sender === 'user' ? 'bubbleUser' : 'bubbleBot'}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>

      <div className="inputContainer">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          className="inputField"
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage} className="sendButton">
          <i class='bx bx-up-arrow-alt' style={{color:'black'}}></i> 
        </button>
      </div>
    </div>
  );
}

export default Chatbot;
