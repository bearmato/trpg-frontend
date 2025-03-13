// 定义按钮动作类型
export interface MessageAction {
  label: string;
  action: string;
  style?: 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';
}

// 消息类型定义
export interface Message {
  role: "player" | "gm" | "system";  // 添加系统消息类型
  text: string;
  timestamp: Date;
  actions?: MessageAction[];  // 可选的按钮动作
}
  
// 聊天会话类型
export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  lastUpdatedAt: Date;
}