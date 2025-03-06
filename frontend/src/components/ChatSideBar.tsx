import React from "react";

import { ChatSession } from "../types/chat";

interface ChatSideBarProps {
  chatSessions: ChatSession[];
  activeChatId: string | null;
  setActiveChatId: (id: string) => void;
  createNewChatSession: () => void;
  deleteChatSession: (id: string) => void;
}

// 格式化日期为简单字符串
const formatDate = (date: Date) => {
  return (
    date.toLocaleDateString() +
    " " +
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );
};

// 获取消息预览
const getMessagePreview = (messages: any[]) => {
  if (messages.length === 0) return "No messages";
  const lastMessage = messages[messages.length - 1];
  const text = lastMessage.text;
  return text.length > 40 ? text.substring(0, 40) + "..." : text;
};

const ChatSideBar: React.FC<ChatSideBarProps> = ({
  chatSessions,
  activeChatId,
  setActiveChatId,
  createNewChatSession,
  deleteChatSession,
}) => {
  return (
    <div className="w-64 bg-base-200 flex flex-col border-r border-base-content/10 overflow-hidden">
      <div className="p-2 flex justify-between items-center border-b border-base-content/10">
        <h2 className="text-lg font-bold">Chat History</h2>
        <button
          className="btn btn-sm btn-ghost"
          onClick={createNewChatSession}
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
              <h3 className="font-medium text-sm truncate">{session.title}</h3>
              <button
                className="btn btn-xs btn-ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteChatSession(session.id);
                }}
                title="删除聊天"
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
  );
};

export default ChatSideBar;
