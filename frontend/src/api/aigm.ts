import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api/aigm";

/**
 * 发送消息给 AI GM
 * @param message 用户输入的消息
 * @returns AI GM 的回复
 */
export const sendMessageToAIGM = async (message: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/chat/`, { message });
    return response.data.reply;
  } catch (error) {
    console.error("Error communicating with AI GM:", error);
    return "Error: Unable to reach AI GM.";
  }
};