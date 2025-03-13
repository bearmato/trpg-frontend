// 定义按钮动作类型
export interface MessageAction {
  label: string;
  action: string;
  style?: 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';
}

// 消息类型定义
export interface Message {
  role: "player" | "gm" | "system";  // 系统消息可用于UI元素
  text: string;  // 可以包含HTML（系统消息）或纯文本
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