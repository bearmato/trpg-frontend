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
  language: string; //language choice
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
  subrace?: string;  //subrace information
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
    // 构建API请求数据
    const requestData = {
      name: options.name,
      race: options.race,
      subrace: options.subrace,
      class: options.class, 
      gender: options.gender,
      style: options.style,
      features: options.features,
      should_save: true // 始终自动保存
    };
    
    const response = await axios.post(
      `${API_BASE_URL}/character-portrait/`, 
      requestData
    );
    
    // 确保返回的图片 URL 是完整的
    const image_url = response.data.image_url;
    if (image_url && !image_url.startsWith('http')) {
      response.data.image_url = `${API_BASE_URL}${image_url}`;
    }
    
    // 确保返回public_id（如果后端提供）
    if (!response.data.public_id && response.data.cloudinary_public_id) {
      response.data.public_id = response.data.cloudinary_public_id;
    }
    
    return response.data;
  } catch (error) {
    console.error("Failed to generate character portrait:", error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "Failed to generate character portrait");
    }
    throw new Error("Cannot connect to AI GM service");
  }
};