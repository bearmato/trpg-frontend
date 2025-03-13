import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api/aigm";

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

// Adventure-related code removed

/**
 * Character background generator options
 */
export interface BackgroundOptions {
  name: string;
  race: string;
  class: string;
  keywords: string[];
  tone: string;
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