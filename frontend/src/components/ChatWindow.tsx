import React, { useRef, useEffect } from "react";
import { Message } from "../types/chat";

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  activeChatId: string | null;
  createNewChatSession: () => void;
}

// 格式化日期为简单字符串
const formatDate = (date: Date) => {
  return (
    date.toLocaleDateString() +
    " " +
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );
};

const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  isLoading,
  error,
  activeChatId,
  createNewChatSession,
}) => {
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="overflow-y-auto p-4">
      <div
        ref={chatContainerRef}
        className="max-w-4xl mx-auto bg-base-200 rounded-xl shadow-sm border border-base-300 p-4"
      >
        {activeChatId ? (
          messages.map((msg, index) => (
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
                    alt={msg.role === "player" ? "Player" : "Game Master"}
                    onError={(e) => {
                      // 图片加载失败时使用占位符
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
                {msg.role === "player" ? "player" : "Game Master"}
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
                {/* 支持简单的文本格式化，如换行 */}
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
                从侧边栏选择对话或创建新对话
              </p>
              <button
                className="btn btn-primary mt-4"
                onClick={() => createNewChatSession()}
              >
                开始新对话
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
  );
};

export default ChatWindow;
