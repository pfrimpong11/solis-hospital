'use client';

import { useState, useRef, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { useAssistantStore, MessageType } from '@/lib/assistantStore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Trash2, 
  PlusCircle, 
  MessageSquare, 
  Bot, 
  User, 
  Clock, 
  Edit2, 
  Check, 
  X, 
  Loader,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock AI response generator for demo purposes
const mockAIResponse = async (message: string): Promise<string> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
  
  const responses = [
    "I understand your concern. Based on the symptoms you've described, it could be several things. I'd recommend consulting with one of our doctors.",
    "That's a good question about medication. Let me provide some general information, but please consult with your doctor for personalized advice.",
    "Your health is important to us at SOLIS Hospital. Could you provide more details so I can give you better guidance?",
    "Regular check-ups are important for preventative healthcare. Would you like me to provide information about our check-up packages?",
    "Based on medical literature, these symptoms might indicate several conditions. Our specialists can provide an accurate diagnosis.",
    "SOLIS Hospital offers various specialists who can help with your condition. Would you like me to help schedule an appointment?",
    "Maintaining a balanced diet and regular exercise are key to managing that condition. Would you like some specific recommendations?",
    "I'm here to help answer your health questions. What specific information are you looking for today?",
    "That's a common concern among many patients. Our healthcare professionals at SOLIS are well-equipped to help with this issue.",
    "Thank you for sharing that information. It helps me provide more relevant assistance with your healthcare needs."
  ];
  
  // If the message contains specific health keywords, provide more targeted responses
  if (message.toLowerCase().includes('headache') || message.toLowerCase().includes('pain')) {
    return "Pain management is important. For headaches, it could be due to various factors like stress, dehydration, or other underlying conditions. Our specialists at SOLIS can provide proper diagnosis and treatment. Would you like to schedule an appointment?";
  }
  
  if (message.toLowerCase().includes('fever') || message.toLowerCase().includes('temperature')) {
    return "Fevers are often the body's response to infection. If you're experiencing a persistent high fever, it's important to consult with a healthcare provider. Would you like information about our urgent care services?";
  }
  
  if (message.toLowerCase().includes('appointment') || message.toLowerCase().includes('schedule')) {
    return "I can help you with scheduling an appointment at SOLIS Hospital. Our available slots for the coming week are filling up quickly. Would you prefer a morning or afternoon consultation?";
  }
  
  // Default to random response
  return responses[Math.floor(Math.random() * responses.length)] || "I'm here to help with your healthcare questions.";
};

const ChatMessage = ({ message }: { message: MessageType }) => {
  const isUser = message.role === 'user';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start gap-3 mb-4 ${
        isUser ? 'flex-row-reverse' : ''
      }`}
    >
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
          isUser
            ? 'bg-blue-600 text-white'
            : 'bg-green-600 text-white'
        }`}
      >
        {isUser ? <User size={20} /> : <Bot size={20} />}
      </div>
      <div
        className={cn(
          'p-4 rounded-xl max-w-[80%]',
          isUser
            ? 'bg-blue-600 text-white rounded-tr-none'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-tl-none'
        )}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        <p className="text-xs mt-2 opacity-70">
          {new Date(message.timestamp).toLocaleTimeString()}
        </p>
      </div>
    </motion.div>
  );
};

const ConversationListItem = ({
  conversation,
  active,
  onClick,
  onDelete,
  onRename,
}: {
  conversation: any;
  active: boolean;
  onClick: () => void;
  onDelete: () => void;
  onRename: (title: string) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(conversation.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    onRename(title);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setTitle(conversation.title);
      setIsEditing(false);
    }
  };

  return (
    <div
      className={`flex items-center group p-3 cursor-pointer rounded-lg mb-1 ${
        active
          ? 'bg-blue-100 dark:bg-blue-900/30'
          : 'hover:bg-gray-100 dark:hover:bg-gray-800'
      }`}
      onClick={onClick}
    >
      <div className="flex-shrink-0 mr-3">
        <MessageSquare size={20} className="text-gray-500 dark:text-gray-400" />
      </div>
      <div className="flex-grow min-w-0">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 focus:outline-none py-1"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <p className="truncate text-sm">
            {conversation.title}
          </p>
        )}
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {new Date(conversation.updatedAt).toLocaleDateString()}
        </p>
      </div>
      <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
        {isEditing ? (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSave();
              }}
              className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
            >
              <Check size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setTitle(conversation.title);
                setIsEditing(false);
              }}
              className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
            >
              <X size={16} />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
            >
              <Trash2 size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default function HealthAssistantPage() {
  const { user } = useStore();
  const {
    conversations,
    currentConversationId,
    setCurrentConversationId,
    addConversation,
    addMessage,
    deleteConversation,
    updateConversationTitle,
    getConversationsByUserId,
  } = useAssistantStore();
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Initialize with dummy conversation if none exists
  useEffect(() => {
    if (!user) return;

    // Use user's name or email as a unique ID if id is not available
    const userId = user.id || user.email || user.name;
    
    const userConversations = getConversationsByUserId(userId);
    
    if (userConversations.length === 0) {
      const newConversationId = addConversation(userId);
      
      // Add welcome message
      addMessage(newConversationId, {
        content: `Hello ${user.name || 'there'}, I'm SOLIS Health Assistant. How can I help you today?`,
        role: 'assistant',
      });
    } else if (!currentConversationId || !conversations[currentConversationId]) {
      if (userConversations.length > 0 && userConversations[0]) {
        setCurrentConversationId(userConversations[0].id);
      }
    }
  }, [user, conversations, currentConversationId, addConversation, addMessage, getConversationsByUserId, setCurrentConversationId]);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConversationId, conversations]);

  // Focus input when conversation changes
  useEffect(() => {
    inputRef.current?.focus();
  }, [currentConversationId]);

  const currentConversation = currentConversationId ? conversations[currentConversationId] : null;
  const userConversations = user ? getConversationsByUserId(user.id) : [];

  const handleNewConversation = () => {
    if (!user) return;
    
    // Use user's name or email as a unique ID if id is not available
    const userId = user.id || user.email || user.name;
    const newId = addConversation(userId);
    
    // Add welcome message to new conversation
    addMessage(newId, {
      content: `Hello ${user.name || 'there'}, I'm SOLIS Health Assistant. How can I help you today?`,
      role: 'assistant',
    });
  };

  const handleSend = async () => {
    if (!input.trim() || !currentConversationId || !user) return;
    
    const userMessage = input.trim();
    setInput('');
    
    // Add user message to conversation
    addMessage(currentConversationId, {
      content: userMessage,
      role: 'user',
    });
    
    // Set loading state
    setIsLoading(true);
    
    try {
      // Get AI response (mocked)
      const aiResponse = await mockAIResponse(userMessage);
      
      // Add AI response to conversation
      addMessage(currentConversationId, {
        content: aiResponse,
        role: 'assistant',
      });
      
      // Update conversation title if it's the first message
      if (currentConversation && currentConversation.messages.length === 1) {
        const shortTitle = userMessage.slice(0, 30) + (userMessage.length > 30 ? '...' : '');
        updateConversationTitle(currentConversationId, shortTitle);
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Add error message
      addMessage(currentConversationId, {
        content: "I'm sorry, I encountered an error processing your request. Please try again.",
        role: 'assistant',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Sidebar for conversation history */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 300, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="h-full border-r dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden"
          >
            <div className="flex flex-col h-full">
              <div className="p-4 border-b dark:border-gray-700">
                <button
                  onClick={handleNewConversation}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                >
                  <PlusCircle size={18} />
                  <span>New Conversation</span>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-2">
                {userConversations.length === 0 ? (
                  <div className="text-center p-4 text-gray-500">
                    <MessageSquare className="mx-auto mb-2" />
                    <p>No conversations yet</p>
                  </div>
                ) : (
                  userConversations.map((conv) => (
                    <ConversationListItem
                      key={conv.id}
                      conversation={conv}
                      active={currentConversationId === conv.id}
                      onClick={() => setCurrentConversationId(conv.id)}
                      onDelete={() => deleteConversation(conv.id)}
                      onRename={(title) => updateConversationTitle(conv.id, title)}
                    />
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat area */}
      <div className="flex-1 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <div className="flex items-center">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="mr-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {sidebarOpen ? <X size={20} /> : <MessageSquare size={20} />}
            </button>
            <div>
              <h2 className="font-semibold">
                SOLIS Health Assistant
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                AI-powered healthcare support
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {currentConversation ? (
            currentConversation.messages.length > 0 ? (
              <>
                {currentConversation.messages.map((msg: MessageType) => (
                  <ChatMessage key={msg.id} message={msg} />
                ))}
                <div ref={messagesEndRef} />
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                  <Bot size={32} className="text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  How can I help you today?
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
                  Ask me anything about health concerns, medical information, or hospital services at SOLIS.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl">
                  {[
                    "How do I schedule an appointment?",
                    "What symptoms should I watch for with a fever?",
                    "Can you explain blood pressure readings?",
                    "What services does SOLIS hospital offer?"
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => {
                        setInput(suggestion);
                        inputRef.current?.focus();
                      }}
                      className="p-3 border dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-left transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500">Select a conversation or create a new one</p>
            </div>
          )}
        </div>

        {/* Input area */}
        {currentConversation && (
          <div className="border-t dark:border-gray-700 p-4">
            <div className="relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="w-full p-4 pr-16 border dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 resize-none"
                rows={3}
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="absolute bottom-3 right-3 p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? <Loader className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
              SOLIS Health Assistant provides general information and is not a substitute for professional medical advice.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
