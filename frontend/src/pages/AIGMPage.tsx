import { useState } from "react";
import { sendMessageToAIGM } from "../api/aigm"; // 引入 API 封装

const AIGMPage = () => {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>(
    []
  );
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "player", text: input }];
    setMessages(newMessages);

    try {
      const aiReply = await sendMessageToAIGM(input); // 调用封装的 API

      setMessages([...newMessages, { role: "gm", text: aiReply }]);
    } catch (error) {
      console.error("Error sending message:", error);
    }

    setInput("");
  };

  return (
    <div className="flex flex-col h-screen bg-base-200 p-4">
      <h1 className="text-3xl font-bold text-center text-primary mb-4">
        AI Game Master
      </h1>

      {/* 聊天窗口 */}
      <div className="flex-1 overflow-auto bg-white p-4 rounded-lg shadow-sm">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat ${
              msg.role === "player" ? "chat-end" : "chat-start"
            }`}
          >
            <div className="chat-bubble bg-primary text-white">{msg.text}</div>
          </div>
        ))}
      </div>

      {/* 固定输入框 */}
      <div className="sticky bottom-0 left-0 w-full bg-base-200 p-4 flex items-center">
        <input
          type="text"
          placeholder="Ask the AI GM..."
          className="input input-bordered flex-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="btn btn-primary ml-2" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default AIGMPage;
