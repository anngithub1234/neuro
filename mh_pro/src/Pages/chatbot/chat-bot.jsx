import React, { useState, useEffect } from 'react';
import { SendHorizontal, Bot, User, ChevronDown, ChevronUp, Sparkles, Heart, Brain, Smile, Sun, Moon, Stars, Coffee, Music } from 'lucide-react';

// Animated Progress Component with Gradient
const Progress = ({ value = 0, className = '', ...props }) => (
  <div 
    className={`relative h-2 w-full overflow-hidden rounded-full bg-gradient-to-r from-gray-100 to-gray-200 ${className}`}
    {...props}
  >
    <div
      className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500 ease-out"
      style={{ 
        width: `${Math.min(100, Math.max(0, value))}%`,
        animation: 'shimmer 2s infinite linear'
      }}
    />
  </div>
);

// Typing Animation Component
const TypingIndicator = () => (
  <div className="flex space-x-2 items-center p-4 bg-white rounded-lg shadow-sm max-w-[200px]">
    <div className="flex space-x-1">
      {[1, 2, 3].map((dot) => (
        <div
          key={dot}
          className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
          style={{ animationDelay: `${dot * 0.2}s` }}
        />
      ))}
    </div>
    <span className="text-sm text-gray-500">Thinking...</span>
  </div>
);

// Mood Icon Component
const MoodIcon = ({ mood }) => {
  const icons = {
    supportive: <Heart className="w-5 h-5 text-pink-500" />,
    thoughtful: <Brain className="w-5 h-5 text-purple-500" />,
    encouraging: <Sparkles className="w-5 h-5 text-yellow-500" />,
    calm: <Moon className="w-5 h-5 text-blue-500" />,
    energetic: <Sun className="w-5 h-5 text-orange-500" />,
    friendly: <Smile className="w-5 h-5 text-green-500" />,
  };
  return icons[mood] || <Stars className="w-5 h-5 text-gray-500" />;
};

// Enhanced Message Card Component
const MessageCard = ({ message, isExpanded, toggleExpand, Progress }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (typeof message.text === 'string') {
    return (
      <div className={`space-y-2 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <p className="text-sm leading-relaxed">{message.text}</p>
        {message.sender === 'bot' && message.mood && (
          <div className="flex items-center gap-2 mt-2">
            <MoodIcon mood={message.mood} />
            <span className="text-sm text-gray-600 italic">{message.mood}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-4 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {/* Main Prediction with Enhanced Styling */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {message.prediction}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <Progress value={message.confidence} className="w-32" />
            <span className="text-sm text-gray-600">{message.confidence.toFixed(1)}% confident</span>
          </div>
        </div>
        <button
          onClick={toggleExpand}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          {isExpanded ? <ChevronUp className="text-purple-600" /> : <ChevronDown className="text-purple-600" />}
        </button>
      </div>

      {/* Quick Advice with Gradient Background */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-100">
        <div className="flex items-start gap-2">
          <Sparkles className="w-5 h-5 text-blue-600 mt-1" />
          <p className="text-sm flex-1 text-blue-800">{message.advice}</p>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="space-y-4 animate-in slide-in-from-top duration-300">
          {/* Key Terms with Gradient Pills */}
          <div className="flex flex-wrap gap-2">
            {message.keywords.map((word, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-xs font-medium
                          hover:from-blue-200 hover:to-purple-200 transition-colors cursor-default"
              >
                {word}
              </span>
            ))}
          </div>

          {/* Detailed Probabilities */}
          <div className="space-y-3 bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-600" />
              <h4 className="text-sm font-medium">Alternative Interpretations</h4>
            </div>
            {message.probabilities.map(({ label, value }, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">{label}</span>
                  <span className="font-medium text-purple-600">{value.toFixed(1)}%</span>
                </div>
                <Progress value={value} className="h-1.5" />
              </div>
            ))}
          </div>

          {/* Full Explanation with Decorative Elements */}
          <div className="relative bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-lg">
            <div className="absolute top-0 right-0 transform -translate-y-1/2">
              <Sparkles className="w-8 h-8 text-purple-200" />
            </div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-600" />
              <span>Detailed Insight</span>
            </h4>
            <p className="text-sm text-gray-700 leading-relaxed">{message.explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
};

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Hello! I'm here to chat with you about whatever's on your mind. How are you feeling today? 🌟", 
      sender: "bot",
      mood: "friendly" 
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [expandedMessage, setExpandedMessage] = useState(null);

  // Function to get random mood
  const getRandomMood = () => {
    const moods = ['supportive', 'thoughtful', 'encouraging', 'calm', 'energetic', 'friendly'];
    return moods[Math.floor(Math.random() * moods.length)];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputText,
      sender: "user"
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      });
      const data = await response.json();

      const botMessage = {
        id: messages.length + 2,
        sender: "bot",
        prediction: data.predicted_class,
        confidence: Math.max(...Object.values(data.prediction_probs)) * 100,
        probabilities: Object.entries(data.prediction_probs).map(([label, prob]) => ({
          label,
          value: prob * 100
        })),
        advice: data.advice,
        explanation: data.explanation,
        keywords: data.explanation.split(' ')
          .filter(word => word.length > 5)
          .slice(0, 5),
        mood: getRandomMood()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error while fetching from backend", error);
      const errorMessage = {
        id: messages.length + 2,
        text: "I apologize, but I'm having trouble connecting right now. Let's try again in a moment! 🌟",
        sender: "bot",
        mood: "supportive"
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }

    setInputText("");
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-5 bg-gradient-to-b from-gray-50 to-white">
      {/* Header with Gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center gap-3">
          <Brain className="w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold">Your Mindful Companion</h1>
            <p className="text-sm opacity-90">Here to listen, support, and guide you 24/7</p>
          </div>
        </div>
      </div>

      {/* Messages Container with Enhanced Styling */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md
                         ${message.sender === 'bot' 
                           ? 'bg-gradient-to-r from-blue-600 to-purple-600' 
                           : 'bg-gradient-to-r from-gray-700 to-gray-800'}`}
            >
              {message.sender === 'bot' ? 
                <Bot className="w-6 h-6 text-white" /> : 
                <User className="w-6 h-6 text-white" />
              }
            </div>
            <div 
              className={`max-w-[80%] p-4 rounded-lg shadow-sm
                         ${message.sender === 'bot' 
                           ? 'bg-white' 
                           : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'}`}
            >
              <MessageCard 
                message={message} 
                isExpanded={expandedMessage === message.id}
                toggleExpand={() => setExpandedMessage(expandedMessage === message.id ? null : message.id)}
                Progress={Progress}
              />
            </div>
          </div>
        ))}
        {loading && <TypingIndicator />}
      </div>

      {/* Input Form with Enhanced Styling */}
      <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg shadow-lg border border-gray-100">
        <div className="flex gap-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Share your thoughts..."
            className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent
                      placeholder:text-gray-400 text-gray-700"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="p-3 text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg
                     hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2
                     disabled:opacity-50 disabled:cursor-not-allowed transform transition-transform hover:scale-105"
          >
            <SendHorizontal className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;