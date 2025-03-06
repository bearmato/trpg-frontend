// 消息类型定义

  
export interface Message {
    role: "player" | "gm";
    text: string;
    timestamp: Date;
  }
  
  // 聊天会话类型
  export interface ChatSession {
    id: string;
    title: string;
    messages: Message[];
    createdAt: Date;
    lastUpdatedAt: Date;
  }