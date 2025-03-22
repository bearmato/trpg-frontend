import axios from "axios";

const API_BASE_URL = "https://trpg-backend-production-fb60.up.railway.app/api/aigm";

/**
 * Send a message to AI GM with conversation history
 * @param message User input message
 * @param history Conversation history
 * @returns AI GM's reply
 */
export const sendMessageToAIGM = async (
  message: string, 
  history: Array<{ role: string; text: string }>
) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/chat/`, {
      message,
      history,
    });
    return response.data.reply;
  } catch (error) {
    console.error("Error communicating with AI GM:", error);
    if (axios.isAxiosError(error) && error.response) {
      // Return server error message
      throw new Error(error.response.data.error || "Failed to communicate with AI GM");
    }
    throw new Error("Cannot connect to AI GM service");
  }
};

// 更新后的接口定义，增加背景和阵营参数

// 更新后的接口定义，增加语言选择参数

/**
 * Character background generator options
 */
export interface BackgroundOptions {
  name: string;
  race: string;
  class: string;
  background: string;
  alignment: string;
  keywords: string[];
  tone: string;
  language: string; // 新增：语言选择参数
}

/**
 * Generate character background story
 * @param options Character details and story preferences
 * @returns Generated background story
 */
export const generateCharacterBackground = async (options: BackgroundOptions) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/character-background/`, 
      options
    );
    return response.data;
  } catch (error) {
    console.error("Failed to generate character background:", error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "Failed to generate character background");
    }
    throw new Error("Cannot connect to AI GM service");
  }
};
/**
 * Character portrait generator options
 */
export interface PortraitOptions {
  name: string;
  race: string;
  subrace?: string;  // 添加亚种信息
  class: string;
  gender: string;
  style: string;
  features: string[];
}

/**
 * Generate character portrait image
 * @param options Character details and portrait preferences
 * @returns Generated portrait URL and character info
 */
export const generateCharacterPortrait = async (options: PortraitOptions) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/character-portrait/`, 
      options
    );
    return response.data;
  } catch (error) {
    console.error("Failed to generate character portrait:", error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "Failed to generate character portrait");
    }
    throw new Error("Cannot connect to AI GM service");
  }
};