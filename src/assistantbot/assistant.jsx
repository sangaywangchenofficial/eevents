import React, { useState, useRef, useEffect } from 'react';
import { API_BASE_URL, APP_NAME_CAPITALIZED } from '../utils/auth';

const SUGGESTED_QUESTIONS = [
    "What does the company do?",
    "What services do you provide?",
    "How can I contact you?",
    "What are your products?",
    "Tell me about the company."
];

const AIAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: `Hello! I'm ${APP_NAME_CAPITALIZED}'s AI Assistant. How can I help you today?`,
            sender: 'bot',
            timestamp: new Date().toLocaleTimeString()
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Auto-scroll to bottom of messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [isOpen]);

    // Check system preference for dark mode
    useEffect(() => {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setIsDarkMode(true);
        }
    }, []);

    const clearChat = () => {
        setMessages([
            {
                id: 1,
                text: `Hello! I'm ${APP_NAME_CAPITALIZED}'s AI Assistant. How can I help you today?`,
                sender: 'bot',
                timestamp: new Date().toLocaleTimeString()
            }
        ]);
    };

    const handleSuggestedClick = (question) => {
        sendMessage(question);
    };

    const sendMessage = async (textToSend) => {
        const text = textToSend || inputMessage;
        if (!text.trim()) return;

        const userMessage = {
            id: Date.now(),
            text: text,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString()
        };

        setMessages(prev => [...prev, userMessage]);
        if (!textToSend) setInputMessage('');
        setIsTyping(true);

        try {
            const response = await fetch(`${API_BASE_URL}/assistant/chat/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: text,
                    history: messages
                })
            });

            const data = await response.json();

            if (response.ok) {
                const botMessage = {
                    id: Date.now() + 1,
                    text: data.response,
                    sender: 'bot',
                    timestamp: new Date().toLocaleTimeString()
                };
                setMessages(prev => [...prev, botMessage]);
            } else {
                throw new Error(data.error || "Failed to get response");
            }
        } catch (error) {
            const botMessage = {
                id: Date.now() + 1,
                text: "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again later.",
                sender: 'bot',
                timestamp: new Date().toLocaleTimeString()
            };
            setMessages(prev => [...prev, botMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    // Handle Enter key press
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={`fixed bottom-5 right-5 z-[1000] font-jakarta ${isDarkMode ? 'dark' : ''}`}>
            {/* Chat Toggle Button */}
            <button
                className={`chatbot-toggle-btn w-14 h-14 rounded-full text-white border-none cursor-pointer shadow-[0_4px_15px_rgba(41,187,163,0.4)] transition-all duration-300 hover:scale-105 hover:shadow-[0_6px_20px_rgba(41,187,163,0.6)] flex items-center justify-center relative ${isOpen ? 'bg-[#F47F1D] shadow-[0_4px_15px_rgba(244,127,29,0.4)]' : 'bg-gradient-to-br from-[#29BBA3] to-[#1E8B7A]'}`}
                onClick={toggleChat}
                aria-label="Toggle AI Assistant"
            >
                {isOpen ? (
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </svg>
                ) : (
                    <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
                        <path d="M20 9V7c0-1.1-.9-2-2-2h-3c0-1.66-1.34-3-3-3S9 3.34 9 5H6c-1.1 0-2 .9-2 2v2c-1.66 0-3 1.34-3 3s1.34 3 3 3v4c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-4c1.66 0 3-1.34 3-3s-1.34-3-3-3zm-2 10H6V7h12v12zm-9-6c-.83 0-1.5-.67-1.5-1.5S8.17 10 9 10s1.5.67 1.5 1.5S9.83 13 9 13zm6 0c-.83 0-1.5-.67-1.5-1.5S14.17 10 15 10s1.5.67 1.5 1.5S15.83 13 15 13zm-5 3h4v-1H10v1z" />
                    </svg>
                )}
                {!isOpen && (
                    <span className="absolute top-1 right-1 w-3 h-3 bg-[#F47F1D] rounded-full border-2 border-white animate-[pulse_2s_infinite]"></span>
                )}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="chatbot-window fixed inset-0 sm:absolute sm:inset-auto sm:bottom-20 sm:right-0 sm:w-[380px] sm:h-[500px] md:w-[400px] md:h-[540px] bg-white dark:bg-[#162019] sm:rounded-2xl shadow-[0_10px_40px_rgba(30,53,47,0.15)] flex flex-col overflow-hidden animate-[slideUp_0.3s_ease] z-[1001]">
                    {/* Chat Header */}
                    <div className="bg-gradient-to-br from-[#29BBA3] to-[#1E8B7A] text-white p-4 flex justify-between items-center flex-shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                                    <path d="M20 9V7c0-1.1-.9-2-2-2h-3c0-1.66-1.34-3-3-3S9 3.34 9 5H6c-1.1 0-2 .9-2 2v2c-1.66 0-3 1.34-3 3s1.34 3 3 3v4c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-4c1.66 0 3-1.34 3-3s-1.34-3-3-3zm-2 10H6V7h12v12zm-9-6c-.83 0-1.5-.67-1.5-1.5S8.17 10 9 10s1.5.67 1.5 1.5S9.83 13 9 13zm6 0c-.83 0-1.5-.67-1.5-1.5S14.17 10 15 10s1.5.67 1.5 1.5S15.83 13 15 13zm-5 3h4v-1H10v1z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="m-0 text-base font-semibold">{APP_NAME_CAPITALIZED} AI Assistant</h3>
                                <span className="text-xs opacity-90 flex items-center gap-1.5">
                                    <span className="inline-block w-2 h-2 bg-[#F0A71E] rounded-full animate-[pulse_2s_infinite]"></span>
                                    Online
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                className="bg-transparent border-none text-white cursor-pointer p-1 opacity-70 hover:opacity-100 transition-opacity"
                                onClick={() => setIsDarkMode(!isDarkMode)}
                                title="Toggle Theme"
                            >
                                {isDarkMode ? (
                                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41.39.39 1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41.39.39 1.03.39 1.41 0l1.06-1.06z" /></svg>
                                ) : (
                                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z" /></svg>
                                )}
                            </button>
                            <button
                                className="bg-transparent border-none text-white cursor-pointer p-1 opacity-70 hover:opacity-100 transition-opacity"
                                onClick={clearChat}
                                title="Clear Chat"
                            >
                                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" /></svg>
                            </button>
                            <button
                                className="bg-transparent border-none text-white cursor-pointer p-1 opacity-70 hover:opacity-100 transition-opacity"
                                onClick={toggleChat}
                            >
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Messages Container */}
                    <div className="flex-1 overflow-y-auto p-5 bg-[#FDFDF7] dark:bg-[#0F1A17] flex flex-col gap-3">
                        {messages.length === 1 && (
                            <div className="flex flex-wrap gap-2 mt-2 mb-4">
                                {SUGGESTED_QUESTIONS.map((q, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleSuggestedClick(q)}
                                        className="text-xs bg-white dark:bg-[#1C2B27] dark:text-[#E8F5F2] border border-[#E6E1D8] dark:border-[#3D5550] rounded-full px-3 py-1.5 text-[#1E8B7A] hover:bg-[#F4F3EC] dark:hover:bg-[#2A3D38] transition-colors"
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        )}

                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex animate-[messageAppear_0.3s_ease] ${message.sender === 'bot' ? 'justify-start' : 'justify-end'}`}
                            >
                                <div className={`max-w-[80%] p-3 rounded-xl relative ${message.sender === 'bot'
                                    ? 'bg-white dark:bg-[#1C2B27] text-[#1E352F] dark:text-[#E8F5F2] rounded-bl-[4px] shadow-[0_2px_8px_rgba(30,53,47,0.05)] border border-[#E6E1D8] dark:border-[#2A3D38]'
                                    : 'bg-gradient-to-br from-[#29BBA3] to-[#1E8B7A] text-white rounded-br-[4px] shadow-[0_2px_8px_rgba(41,187,163,0.15)]'
                                    }`}>
                                    <div className="text-sm leading-relaxed break-words">{message.text}</div>
                                    <span className={`text-[10px] opacity-70 mt-1 block ${message.sender === 'user' ? 'text-right text-[#E8F5F2]' : 'text-[#66756F] dark:text-[#7AA49D]'
                                        }`}>
                                        {message.timestamp}
                                    </span>
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex justify-start animate-[messageAppear_0.3s_ease]">
                                <div className="bg-white dark:bg-[#1C2B27] rounded-xl rounded-bl-[4px] shadow-[0_2px_8px_rgba(30,53,47,0.05)] border border-[#E6E1D8] dark:border-[#2A3D38] p-3">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-[#29BBA3] rounded-full animate-[typing_1.4s_infinite]"></span>
                                        <span className="w-2 h-2 bg-[#29BBA3] rounded-full animate-[typing_1.4s_infinite] delay-200"></span>
                                        <span className="w-2 h-2 bg-[#29BBA3] rounded-full animate-[typing_1.4s_infinite] delay-400"></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Container */}
                    <div className="p-4 bg-white dark:bg-[#162019] border-t border-[#E6E1D8] dark:border-[#2A3D38] flex gap-2.5 items-end flex-shrink-0">
                        <textarea
                            ref={inputRef}
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your message..."
                            rows="1"
                            className="flex-1 bg-[#FDFDF7] dark:bg-[#0F1A17] text-[#1E352F] dark:text-[#E8F5F2] border border-[#E6E1D8] dark:border-[#3D5550] rounded-full py-2.5 px-4 text-sm resize-none font-sans outline-none transition-colors focus:border-[#29BBA3] focus:shadow-[0_0_0_3px_rgba(41,187,163,0.1)] max-h-[100px] leading-relaxed placeholder:text-[#66756F] dark:placeholder:text-[#7AA49D]"
                        />
                        <button
                            onClick={() => sendMessage()}
                            disabled={!inputMessage.trim() || isTyping}
                            className="w-10 h-10 rounded-full bg-gradient-to-br from-[#29BBA3] to-[#1E8B7A] text-white border-none cursor-pointer flex items-center justify-center transition-all duration-300 flex-shrink-0 hover:scale-105 hover:shadow-[0_4px_15px_rgba(41,187,163,0.4)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                            aria-label="Send message"
                        >
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                            </svg>
                        </button>
                    </div>

                    {/* Chat Footer */}
                    <div className="py-2 px-5 bg-[#F4F3EC] dark:bg-[#162019] border-t border-[#E6E1D8] dark:border-[#2A3D38] text-center flex-shrink-0">
                        <span className="text-[10px] text-[#66756F] dark:text-[#7AA49D]">{APP_NAME_CAPITALIZED} AI Assistant v1.0</span>
                    </div>
                </div>
            )}

            <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes messageAppear {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes typing {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.4;
          }
          30% {
            transform: translateY(-6px);
            opacity: 1;
          }
        }
        
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.7;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        /* Custom scrollbar styles */
        ::-webkit-scrollbar {
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #C8C2B8;
          border-radius: 3px;
        }
        
        .dark ::-webkit-scrollbar-thumb {
          background: #3D5550;
        }

        /* ── Responsive chat window ── */

        /* Mobile (<640px): full-screen overlay using dynamic viewport height */
        @media (max-width: 639px) {
          .chatbot-window {
            width: 100vw !important;
            height: 100dvh !important;
            border-radius: 0 !important;
          }
        }

        /* Tablet (640px–767px): inset panel, not edge-to-edge */
        @media (min-width: 640px) and (max-width: 767px) {
          .chatbot-window {
            width: min(380px, calc(100vw - 32px)) !important;
            height: min(500px, calc(100dvh - 110px)) !important;
          }
        }

        /* Ensure the toggle button always stays visible above the chat window on mobile */
        @media (max-width: 639px) {
          .chatbot-toggle-btn {
            position: fixed !important;
            bottom: 20px !important;
            right: 20px !important;
            z-index: 1002 !important;
          }
        }
      `}</style>
        </div>
    );
};

export default AIAssistant;