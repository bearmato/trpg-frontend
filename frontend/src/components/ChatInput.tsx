import React, { useState } from "react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  disabled: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  disabled,
}) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // 防止在输入框中添加换行
      handleSend();
    }
  };

  return (
    <div className="p-4 bg-base-200 border-t border-base-content/10">
      <div className="max-w-4xl mx-auto bg-base-100 rounded-xl p-2 shadow-sm border border-base-300 flex items-center">
        <textarea
          className="textarea flex-1 mr-2 h-12 min-h-12 border-none focus:outline-none bg-transparent resize-none"
          placeholder="输入你的行动或对话..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading || disabled}
        />
        <button
          className={`btn btn-primary rounded-full ${
            isLoading ? "loading" : ""
          }`}
          onClick={handleSend}
          disabled={isLoading || !input.trim() || disabled}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
