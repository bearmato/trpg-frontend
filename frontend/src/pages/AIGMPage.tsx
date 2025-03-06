import React, { useState, useEffect } from "react";
import { sendMessageToAIGM } from "../api/aigm";
import { useDiceWidget } from "../components/DiceWidgetProvider";
import { Message, ChatSession } from "../types/chat";
import ChatSideBar from "../components/ChatSideBar";
import ChatWindow from "../components/ChatWindow";
import ChatInput from "../components/ChatInput";

// 生成唯一ID
const generateId = () => {
  1;
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
};

// 从第一条GM消息中提取标题
const extractTitle = (message: string, maxLength = 30) => {
  // 获取第一句或前30个字符
  const firstSentence = message.split(/[.!?]\s+/)[0];
  return firstSentence.length > maxLength
    ? firstSentence.substring(0, maxLength) + "..."
    : firstSentence;
};

const AIGMPage: React.FC = () => {
  // 聊天会话状态
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  // 活动聊天UI状态
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 获取骰子功能
  const { toggleDrawer } = useDiceWidget();

  // 组件挂载时，加载保存的聊天会话
  useEffect(() => {
    const savedSessions = loadSavedSessions();

    if (savedSessions.length > 0) {
      setChatSessions(savedSessions);
      setActiveChatId(savedSessions[0].id);
    } else {
      // 创建初始聊天会话
      createNewChatSession();
    }
  }, []);

  // 获取活动聊天会话
  const getActiveChat = (): ChatSession | undefined => {
    return chatSessions.find((session) => session.id === activeChatId);
  };

  // 获取活动聊天的消息
  const getActiveMessages = (): Message[] => {
    const activeChat = getActiveChat();
    return activeChat ? activeChat.messages : [];
  };

  // 从localStorage加载保存的聊天会话
  const loadSavedSessions = (): ChatSession[] => {
    try {
      const savedData = localStorage.getItem("aigm_chat_sessions");
      if (savedData) {
        const sessions = JSON.parse(savedData);
        // 将字符串日期转换回Date对象
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

  // 保存聊天会话到localStorage
  const saveSessions = (sessions: ChatSession[]) => {
    try {
      localStorage.setItem("aigm_chat_sessions", JSON.stringify(sessions));
    } catch (err) {
      console.error("Error saving sessions to localStorage:", err);
    }
  };

  // 创建新的聊天会话
  const createNewChatSession = async (initialMessage?: Message) => {
    const newId = generateId();
    const now = new Date();

    const welcomeMessage: Message = initialMessage || {
      role: "gm",
      text: "Welcome to AI GM! I'm your Game Master, ready to help you create and manage your TRPG games. You can talk directly to me and ask me anything!",
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

  // 删除聊天会话
  const deleteChatSession = (id: string) => {
    const updatedSessions = chatSessions.filter((session) => session.id !== id);
    setChatSessions(updatedSessions);

    // 如果我们删除的是活动聊天，切换到另一个
    if (id === activeChatId) {
      setActiveChatId(
        updatedSessions.length > 0 ? updatedSessions[0].id : null
      );

      // 如果没有聊天了，创建一个新的
      if (updatedSessions.length === 0) {
        createNewChatSession();
      }
    }

    saveSessions(updatedSessions);
  };

  // 更新活动聊天中的消息
  const updateActiveChat = (messages: Message[]) => {
    if (!activeChatId) return;

    const now = new Date();
    const updatedSessions = chatSessions.map((session) => {
      if (session.id === activeChatId) {
        // 如果这是第二条消息，根据GM的第一条回复更新标题
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

  // 处理骰子请求
  const handleDiceRequest = () => {
    // 当用户询问骰子时，只需打开骰子抽屉
    toggleDrawer();
  };

  // 发送消息给AI GM
  const sendMessage = async (input: string) => {
    if (!activeChatId || !input.trim() || isLoading) return;

    const activeMessages = getActiveMessages();
    const now = new Date();
    const userMessage: Message = {
      role: "player",
      text: input,
      timestamp: now,
    };
    const newMessages = [...activeMessages, userMessage];

    // 使用用户消息更新聊天
    updateActiveChat(newMessages);
    setIsLoading(true);
    setError(null);

    try {
      // 检查消息是否在询问骰子
      const diceRegex = /\b(roll|dice|d4|d6|d8|d10|d12|d20|d100)\b/i;
      if (diceRegex.test(input)) {
        // 打开骰子抽屉
        handleDiceRequest();

        // 为骰子请求创建自定义GM响应
        const aiReply: Message = {
          role: "gm",
          text: "To roll dice, you can use the floating dice button that appears in the bottom right of every page. Click it to open the dice roller!",
          timestamp: new Date(),
        };

        updateActiveChat([...newMessages, aiReply]);
        setIsLoading(false);
        return;
      }

      // 对于其他消息，将消息历史传递给后端
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

  return (
    <div className="flex h-screen bg-base-100 overflow-hidden">
      {/* 左侧边栏 - 聊天历史 */}
      <ChatSideBar
        chatSessions={chatSessions}
        activeChatId={activeChatId}
        setActiveChatId={setActiveChatId}
        createNewChatSession={createNewChatSession}
        deleteChatSession={deleteChatSession}
      />

      {/* 主聊天区域 - 使用网格布局确保固定输入 */}
      <div className="flex-1 grid grid-rows-[auto_1fr_auto] h-screen">
        {/* 顶部标题 */}
        <div className="p-3 bg-base-200 shadow-sm border-b border-base-content/10">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-primary">AI Game Master</h1>
          </div>
        </div>

        {/* 聊天窗口 - 固定在网格的中间行 */}
        <ChatWindow
          messages={getActiveMessages()}
          isLoading={isLoading}
          error={error}
          activeChatId={activeChatId}
          createNewChatSession={createNewChatSession}
        />

        {/* 输入区域 - 固定在网格的底部行 */}
        <ChatInput
          onSendMessage={sendMessage}
          isLoading={isLoading}
          disabled={!activeChatId}
        />
      </div>
    </div>
  );
};

export default AIGMPage;
