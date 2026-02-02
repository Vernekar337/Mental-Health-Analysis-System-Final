import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Users, Send, ArrowLeft, Shield } from 'lucide-react';

const ROOMS = [
  { id: 1, name: 'General Support', active: 12 },
  { id: 2, name: 'Academic Stress', active: 8 },
  { id: 3, name: 'Anxiety & Panic', active: 5 },
  { id: 4, name: 'Sleep Issues', active: 3 },
];

const INITIAL_MESSAGES = [
  { id: 1, text: 'Hello everyone.', sender: 'peer', timestamp: '10:00 AM' },
  { id: 2, text: 'Hi there. How are you feeling today?', sender: 'peer', timestamp: '10:01 AM' },
];

const RelaxRoom = () => {
  const [currentRoom, setCurrentRoom] = useState(null);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mock WebSocket incoming messages
  useEffect(() => {
    if (!currentRoom) return;

    const interval = setInterval(() => {
      const randomMsg = [
        "I understand.",
        "That sounds tough.",
        "Take a deep breath.",
        "You are not alone.",
        "We are here for you."
      ];
      const text = randomMsg[Math.floor(Math.random() * randomMsg.length)];

      // Only add message occasionally
      if (Math.random() > 0.7) {
        setMessages(prev => [...prev, {
          id: Date.now(),
          text: text,
          sender: 'peer',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [currentRoom]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'me',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
  };

  if (!currentRoom) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Relax Room</h1>
          <p className="text-slate-500 mt-1">Anonymous peer emotional support. No names, no judgment.</p>
        </div>

        <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex items-start">
          <Shield className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-blue-800">Community Guidelines</h3>
            <p className="text-sm text-blue-700 mt-1">
              This is a safe space. Please be respectful and kind.
              Identifying information, harassment, or emojis are not allowed to maintain a calm atmosphere.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ROOMS.map(room => (
            <button
              key={room.id}
              onClick={() => {
                setCurrentRoom(room);
                setMessages(INITIAL_MESSAGES);
              }}
              className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all text-left group"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-slate-800 group-hover:text-emerald-700">{room.name}</h3>
                <div className="flex items-center text-slate-400 text-xs bg-slate-100 px-2 py-1 rounded-full">
                  <Users className="w-3 h-3 mr-1" />
                  {room.active}
                </div>
              </div>
              <p className="text-sm text-slate-500">Join anonymously</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
        <div className="flex items-center">
          <button onClick={() => setCurrentRoom(null)} className="mr-4 text-slate-500 hover:text-slate-800 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="font-bold text-slate-800">{currentRoom.name}</h2>
            <span className="text-xs text-emerald-600 flex items-center">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 pulse"></span>
              Live
            </span>
          </div>
        </div>
        <div className="text-xs text-slate-400">Anonymous Mode</div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg text-sm ${msg.sender === 'me'
                  ? 'bg-emerald-600 text-white rounded-br-none'
                  : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none shadow-sm'
                }`}
            >
              <p>{msg.text}</p>
              <p className={`text-[10px] mt-1 text-right ${msg.sender === 'me' ? 'text-emerald-200' : 'text-slate-400'}`}>
                {msg.timestamp}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="bg-emerald-600 text-white p-2 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default RelaxRoom;
