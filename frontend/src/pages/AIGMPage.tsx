import React, { useState, useRef, useEffect } from "react";
import {
  sendMessageToAIGM,
  startNewAdventure,
  generateCharacterBackground,
  BackgroundOptions,
} from "../api/aigm";
import { useDiceWidget } from "../components/DiceWidgetProvider";

// Message type definition
interface Message {
  role: "player" | "gm";
  text: string;
  timestamp: Date;
}

// Chat session type
interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  lastUpdatedAt: Date;
}

// Adventure type options
const adventureTypes = [
  { id: "fantasy", name: "Fantasy Adventure" },
  { id: "horror", name: "Horror Story" },
  { id: "scifi", name: "Sci-Fi Exploration" },
  { id: "mystery", name: "Mystery Investigation" },
  { id: "historical", name: "Historical Adventure" },
];

// Difficulty options
const difficultyLevels = [
  { id: "easy", name: "Easy" },
  { id: "medium", name: "Medium" },
  { id: "hard", name: "Hard" },
  { id: "deadly", name: "Deadly" },
];

// Background story tone options
const toneOptions = [
  { id: "heroic", name: "Heroic" },
  { id: "tragic", name: "Tragic" },
  { id: "mysterious", name: "Mysterious" },
  { id: "comical", name: "Comical" },
  { id: "balanced", name: "Balanced" },
];

// Generate a unique ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
};

// Format date to simple string
const formatDate = (date: Date) => {
  return (
    date.toLocaleDateString() +
    " " +
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );
};

// Extract title from first GM message
const extractTitle = (message: string, maxLength = 30) => {
  // Get first sentence or first 30 chars
  const firstSentence = message.split(/[.!?]\s+/)[0];
  return firstSentence.length > maxLength
    ? firstSentence.substring(0, maxLength) + "..."
    : firstSentence;
};

const AIGMPage: React.FC = () => {
  // Chat sessions state
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  // Active chat UI state
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showNewAdventureModal, setShowNewAdventureModal] = useState(false);
  const [showBackgroundModal, setShowBackgroundModal] = useState(false);

  // Adventure settings
  const [adventureType, setAdventureType] = useState("fantasy");
  const [difficulty, setDifficulty] = useState("medium");
  const [partyLevel, setPartyLevel] = useState(1);
  const [setting, setSetting] = useState("");

  // Character background generator settings
  const [characterName, setCharacterName] = useState("");
  const [characterRace, setCharacterRace] = useState("");
  const [characterClass, setCharacterClass] = useState("");
  const [backgroundKeywords, setBackgroundKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [backgroundTone, setBackgroundTone] = useState("balanced");

  // Reference to chat container for automatic scrolling
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Get dice functionality from context
  const { toggleDrawer } = useDiceWidget();

  // On component mount, load saved chat sessions
  useEffect(() => {
    const savedSessions = loadSavedSessions();

    if (savedSessions.length > 0) {
      setChatSessions(savedSessions);
      setActiveChatId(savedSessions[0].id);
    } else {
      // Create an initial chat session
      createNewChatSession();
    }
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [activeChatId, chatSessions]);

  // Get active chat session
  const getActiveChat = (): ChatSession | undefined => {
    return chatSessions.find((session) => session.id === activeChatId);
  };

  // Get messages from active chat
  const getActiveMessages = (): Message[] => {
    const activeChat = getActiveChat();
    return activeChat ? activeChat.messages : [];
  };

  // Load saved chat sessions from localStorage
  const loadSavedSessions = (): ChatSession[] => {
    try {
      const savedData = localStorage.getItem("aigm_chat_sessions");
      if (savedData) {
        const sessions = JSON.parse(savedData);
        // Convert string dates back to Date objects
        return sessions.map((session: any) => ({
          ...session,
          createdAt: new Date(session.createdAt),
          lastUpdatedAt: new Date(session.lastUpdatedAt),
          messages: session.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
        }));
      }
    } catch (err) {
      console.error("Error loading sessions from localStorage:", err);
    }
    return [];
  };

  // Save chat sessions to localStorage
  const saveSessions = (sessions: ChatSession[]) => {
    try {
      localStorage.setItem("aigm_chat_sessions", JSON.stringify(sessions));
    } catch (err) {
      console.error("Error saving sessions to localStorage:", err);
    }
  };

  // Create a new chat session
  const createNewChatSession = async (initialMessage?: Message) => {
    const newId = generateId();
    const now = new Date();

    const welcomeMessage: Message = initialMessage || {
      role: "gm",
      text: 'Welcome to AI GM! I\'m your Game Master, ready to help you create and manage your TRPG games. You can talk directly to me or click the "New Adventure" button to start a fresh adventure! Feel free to ask me anything.',
      timestamp: now,
    };

    const newSession: ChatSession = {
      id: newId,
      title: initialMessage
        ? extractTitle(initialMessage.text)
        : "New Adventure",
      messages: [welcomeMessage],
      createdAt: now,
      lastUpdatedAt: now,
    };

    const updatedSessions = [newSession, ...chatSessions];
    setChatSessions(updatedSessions);
    setActiveChatId(newId);
    saveSessions(updatedSessions);

    return newId;
  };

  // Delete a chat session
  const deleteChatSession = (id: string) => {
    const updatedSessions = chatSessions.filter((session) => session.id !== id);
    setChatSessions(updatedSessions);

    // If we're deleting the active chat, switch to another
    if (id === activeChatId) {
      setActiveChatId(
        updatedSessions.length > 0 ? updatedSessions[0].id : null
      );

      // If no chats left, create a new one
      if (updatedSessions.length === 0) {
        createNewChatSession();
      }
    }

    saveSessions(updatedSessions);
  };

  // Update messages in active chat
  const updateActiveChat = (messages: Message[]) => {
    if (!activeChatId) return;

    const now = new Date();
    const updatedSessions = chatSessions.map((session) => {
      if (session.id === activeChatId) {
        // If this is the second message, update the title based on GM's first response
        const shouldUpdateTitle =
          session.messages.length === 1 && messages.length > 1;
        const newTitle =
          shouldUpdateTitle && messages[1].role === "gm"
            ? extractTitle(messages[1].text)
            : session.title;

        return {
          ...session,
          messages,
          title: newTitle,
          lastUpdatedAt: now,
        };
      }
      return session;
    });

    setChatSessions(updatedSessions);
    saveSessions(updatedSessions);
  };

  // Handle dice requests
  const handleDiceRequest = () => {
    // Just open the dice drawer when user asks about dice
    toggleDrawer();
  };

  // Send message to AI GM
  const sendMessage = async () => {
    if (!activeChatId || !input.trim() || isLoading) return;

    const activeMessages = getActiveMessages();
    const now = new Date();
    const userMessage: Message = {
      role: "player",
      text: input,
      timestamp: now,
    };
    const newMessages = [...activeMessages, userMessage];

    // Update chat with user message
    updateActiveChat(newMessages);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      // Check if message is asking about dice rolling
      const diceRegex = /\b(roll|dice|d4|d6|d8|d10|d12|d20|d100)\b/i;
      if (diceRegex.test(input)) {
        // Open the dice drawer
        handleDiceRequest();

        // Create a custom GM response for dice requests
        const aiReply: Message = {
          role: "gm",
          text: "To roll dice, you can use the floating dice button that appears in the bottom right of every page. Click it to open the dice roller!",
          timestamp: new Date(),
        };

        updateActiveChat([...newMessages, aiReply]);
        setIsLoading(false);
        return;
      }

      // For other messages, pass message history to backend
      const aiReply = await sendMessageToAIGM(input, activeMessages);
      const gmMessage: Message = {
        role: "gm",
        text: aiReply,
        timestamp: new Date(),
      };

      updateActiveChat([...newMessages, gmMessage]);
    } catch (err) {
      console.error("Error sending message:", err);
      setError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input keyboard events, press Enter to send message
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent adding newline in the input
      sendMessage();
    }
  };

  // Start new adventure
  const handleStartAdventure = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const adventureData = await startNewAdventure({
        adventureType,
        difficulty,
        partyLevel,
        setting: setting.trim() || undefined,
      });

      // Create a new chat session with the adventure introduction
      const now = new Date();
      const initialMessage: Message = {
        role: "gm",
        text: adventureData.introduction,
        timestamp: now,
      };

      createNewChatSession(initialMessage);

      // Close modal and reset form
      setShowNewAdventureModal(false);
      setAdventureType("fantasy");
      setDifficulty("medium");
      setPartyLevel(1);
      setSetting("");
    } catch (err) {
      console.error("Failed to create adventure:", err);
      setError(
        err instanceof Error ? err.message : "Failed to create adventure"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Generate character background
  const handleGenerateBackground = async () => {
    if (!activeChatId) return;
    if (!characterName || !characterRace || !characterClass) {
      setError("Name, race and class are required");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const options: BackgroundOptions = {
        name: characterName,
        race: characterRace,
        class: characterClass,
        keywords: backgroundKeywords,
        tone: backgroundTone,
      };

      const backgroundData = await generateCharacterBackground(options);
      const activeMessages = getActiveMessages();
      const now = new Date();

      // Add background to chat
      const userMessage: Message = {
        role: "player",
        text: `Can you tell me the background story for my ${characterRace} ${characterClass} named ${characterName}?`,
        timestamp: now,
      };

      const gmMessage: Message = {
        role: "gm",
        text: backgroundData.background,
        timestamp: new Date(now.getTime() + 1000), // Add 1 second to ensure proper order
      };

      updateActiveChat([...activeMessages, userMessage, gmMessage]);

      // Close modal
      setShowBackgroundModal(false);

      // Reset form
      setCharacterName("");
      setCharacterRace("");
      setCharacterClass("");
      setBackgroundKeywords([]);
      setKeywordInput("");
    } catch (err) {
      console.error("Failed to generate background:", err);
      setError(
        err instanceof Error ? err.message : "Failed to generate background"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Add keyword to background generator
  const addKeyword = () => {
    if (keywordInput.trim() && backgroundKeywords.length < 5) {
      setBackgroundKeywords([...backgroundKeywords, keywordInput.trim()]);
      setKeywordInput("");
    }
  };

  // Remove keyword from background generator
  const removeKeyword = (index: number) => {
    setBackgroundKeywords(backgroundKeywords.filter((_, i) => i !== index));
  };

  // Get truncated preview of last message
  const getMessagePreview = (messages: Message[]) => {
    if (messages.length === 0) return "No messages";
    const lastMessage = messages[messages.length - 1];
    const text = lastMessage.text;
    return text.length > 40 ? text.substring(0, 40) + "..." : text;
  };

  return (
    <div className="flex h-screen bg-base-100 overflow-hidden">
      {/* Left sidebar - chat history */}
      <div className="w-64 bg-base-200 flex flex-col border-r border-base-content/10 overflow-hidden">
        <div className="p-2 flex justify-between items-center border-b border-base-content/10">
          <h2 className="text-lg font-bold">Chat Sessions</h2>
          <button
            className="btn btn-sm btn-ghost"
            onClick={() => createNewChatSession()}
            title="New Chat"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-2">
          {chatSessions.map((session) => (
            <div
              key={session.id}
              className={`mb-2 p-2 rounded-lg cursor-pointer ${
                session.id === activeChatId
                  ? "bg-primary/20"
                  : "hover:bg-base-200"
              }`}
              onClick={() => setActiveChatId(session.id)}
            >
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-sm truncate">
                  {session.title}
                </h3>
                <button
                  className="btn btn-xs btn-ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteChatSession(session.id);
                  }}
                  title="Delete Chat"
                >
                  ✕
                </button>
              </div>
              <p className="text-xs text-base-content/70 truncate">
                {getMessagePreview(session.messages)}
              </p>
              <p className="text-xs text-base-content/50 mt-1">
                {formatDate(session.lastUpdatedAt)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Main chat area - using a grid layout to ensure fixed input */}
      <div className="flex-1 grid grid-rows-[auto_1fr_auto] h-screen">
        {/* Top header */}
        <div className="p-3 bg-base-200 shadow-sm border-b border-base-content/10">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-primary">AI Game Master</h1>
            <div className="space-x-2">
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => setShowBackgroundModal(true)}
              >
                Character Background
              </button>
              <button
                className="btn btn-sm btn-primary"
                onClick={() => setShowNewAdventureModal(true)}
              >
                New Adventure
              </button>
            </div>
          </div>
        </div>

        {/* Chat window - fixed in the middle row of the grid */}
        <div className="overflow-y-auto p-4">
          <div
            ref={chatContainerRef}
            className="max-w-4xl mx-auto bg-base-200 rounded-xl shadow-sm border border-base-300 p-4"
          >
            {activeChatId ? (
              getActiveMessages().map((msg, index) => (
                <div
                  key={index}
                  className={`chat ${
                    msg.role === "player" ? "chat-end" : "chat-start"
                  } mb-4`}
                >
                  <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                      <img
                        src={
                          msg.role === "player"
                            ? "/images/player-avatar.png"
                            : "/images/gm-avatar.png"
                        }
                        alt={msg.role === "player" ? "Player" : "GM"}
                        onError={(e) => {
                          // If image fails to load, use placeholder
                          const target = e.target as HTMLImageElement;
                          target.src =
                            msg.role === "player"
                              ? "https://via.placeholder.com/40?text=P"
                              : "https://via.placeholder.com/40?text=GM";
                        }}
                      />
                    </div>
                  </div>
                  <div className="chat-header">
                    {msg.role === "player" ? "Player" : "Game Master"}
                    <time className="text-xs opacity-50 ml-1">
                      {formatDate(msg.timestamp)}
                    </time>
                  </div>
                  <div
                    className={`chat-bubble shadow-sm ${
                      msg.role === "player"
                        ? "bg-neutral text-neutral-content"
                        : "bg-primary text-primary-content"
                    }`}
                  >
                    {/* Support simple text formatting like line breaks */}
                    {msg.text.split("\n").map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        {i < msg.text.split("\n").length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <h2 className="text-xl font-bold">No active chat</h2>
                  <p className="text-base-content/70">
                    Select a chat from the sidebar or create a new one
                  </p>
                  <button
                    className="btn btn-primary mt-4"
                    onClick={() => createNewChatSession()}
                  >
                    Start New Chat
                  </button>
                </div>
              </div>
            )}

            {isLoading && (
              <div className="flex justify-center my-2 p-2 bg-base-200 rounded-full w-16 mx-auto">
                <span className="loading loading-dots loading-sm text-primary"></span>
              </div>
            )}

            {error && (
              <div className="alert alert-error mb-4 shadow-sm rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>

        {/* Input area - fixed in the bottom row of the grid */}
        <div className="p-4 bg-base-200 border-t border-base-content/10">
          <div className="max-w-4xl mx-auto bg-base-100 rounded-xl p-2 shadow-sm border border-base-300 flex items-center">
            <textarea
              className="textarea flex-1 mr-2 h-12 min-h-12 border-none focus:outline-none bg-transparent resize-none"
              placeholder="Enter your action or dialogue..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading || !activeChatId}
            />
            <button
              className={`btn btn-primary rounded-full ${
                isLoading ? "loading" : ""
              }`}
              onClick={sendMessage}
              disabled={isLoading || !input.trim() || !activeChatId}
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {/* New Adventure Modal */}
      {showNewAdventureModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Start New Adventure</h3>
            <div className="py-4">
              <div className="form-control">
                <label className="label">Adventure Type</label>
                <select
                  className="select select-bordered w-full"
                  value={adventureType}
                  onChange={(e) => setAdventureType(e.target.value)}
                >
                  {adventureTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">Difficulty</label>
                <select
                  className="select select-bordered w-full"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                >
                  {difficultyLevels.map((level) => (
                    <option key={level.id} value={level.id}>
                      {level.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">Party Level</label>
                <input
                  type="number"
                  className="input input-bordered w-full"
                  value={partyLevel}
                  onChange={(e) =>
                    setPartyLevel(
                      Math.max(1, Math.min(20, parseInt(e.target.value) || 1))
                    )
                  }
                  min="1"
                  max="20"
                />
              </div>

              <div className="form-control">
                <label className="label">Special Setting (Optional)</label>
                <textarea
                  className="textarea textarea-bordered w-full"
                  placeholder="E.g.: In a small town cursed by dark magic..."
                  value={setting}
                  onChange={(e) => setSetting(e.target.value)}
                />
              </div>
            </div>

            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={() => setShowNewAdventureModal(false)}
              >
                Cancel
              </button>
              <button
                className={`btn btn-primary ${isLoading ? "loading" : ""}`}
                onClick={handleStartAdventure}
                disabled={isLoading}
              >
                Start Adventure
              </button>
            </div>
          </div>
          <div
            className="modal-backdrop"
            onClick={() => setShowNewAdventureModal(false)}
          ></div>
        </div>
      )}

      {/* Character Background Generator Modal */}
      {showBackgroundModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Generate Character Background</h3>
            <div className="py-4">
              <div className="form-control">
                <label className="label">Character Name</label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={characterName}
                  onChange={(e) => setCharacterName(e.target.value)}
                  placeholder="Enter character name"
                />
              </div>

              <div className="form-control">
                <label className="label">Race</label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={characterRace}
                  onChange={(e) => setCharacterRace(e.target.value)}
                  placeholder="E.g. Human, Elf, Dwarf"
                />
              </div>

              <div className="form-control">
                <label className="label">Class</label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={characterClass}
                  onChange={(e) => setCharacterClass(e.target.value)}
                  placeholder="E.g. Wizard, Fighter, Rogue"
                />
              </div>

              <div className="form-control">
                <label className="label">Story Tone</label>
                <select
                  className="select select-bordered w-full"
                  value={backgroundTone}
                  onChange={(e) => setBackgroundTone(e.target.value)}
                >
                  {toneOptions.map((tone) => (
                    <option key={tone.id} value={tone.id}>
                      {tone.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  Keywords (up to 5)
                  <span className="label-text-alt">
                    Add elements you want in the story
                  </span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="input input-bordered flex-1"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    placeholder="E.g. revenge, magic, royalty"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addKeyword();
                      }
                    }}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={addKeyword}
                    disabled={
                      !keywordInput.trim() || backgroundKeywords.length >= 5
                    }
                  >
                    Add
                  </button>
                </div>

                {/* Display selected keywords */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {backgroundKeywords.map((keyword, index) => (
                    <div key={index} className="badge badge-primary gap-1">
                      {keyword}
                      <button
                        className="btn btn-xs btn-ghost"
                        onClick={() => removeKeyword(index)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={() => setShowBackgroundModal(false)}
              >
                Cancel
              </button>
              <button
                className={`btn btn-primary ${isLoading ? "loading" : ""}`}
                onClick={handleGenerateBackground}
                disabled={
                  isLoading ||
                  !characterName ||
                  !characterRace ||
                  !characterClass ||
                  !activeChatId
                }
              >
                Generate Background
              </button>
            </div>
          </div>
          <div
            className="modal-backdrop"
            onClick={() => setShowBackgroundModal(false)}
          ></div>
        </div>
      )}
    </div>
  );
};

export default AIGMPage;
