import axios from "axios";
import { Character } from "../types/character";

const API_BASE_URL = "https://trpg-backend-production-fb60.up.railway.app/api/characters";
// 本地开发用
//const API_BASE_URL = "http://localhost:8000/api/characters";

/**
 * 获取用户保存的所有角色列表
 */
export const getUserCharacters = async (): Promise<any[]> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authorized");

    const axiosInstance = createAxiosInstance(token);
    const response = await axiosInstance.get('/');
    return response.data;
  } catch (error) {
    console.error("Error fetching characters:", error);
    throw error;
  }
};

/**
 * 获取角色详情
 */
export const getCharacterById = async (id: string): Promise<any> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authorized");

    const axiosInstance = createAxiosInstance(token);
    const response = await axiosInstance.get(`/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching character ${id}:`, error);
    throw error;
  }
};

export const saveCharacter = async (character: Character): Promise<Character> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authorized");

    // 从stats对象中提取属性值
    const { stats, ...otherDetails } = character;
    
    // 创建符合后端API期望的数据结构
    const characterData = {
      ...otherDetails,
      // 直接展开stats对象，使属性值成为顶级字段
      strength: stats.strength,
      dexterity: stats.dexterity,
      constitution: stats.constitution, 
      intelligence: stats.intelligence,
      wisdom: stats.wisdom,
      charisma: stats.charisma
    };

    console.log("发送到服务器的数据:", characterData);

    const axiosInstance = createAxiosInstance(token);
    const response = await axiosInstance.post('/', characterData);

    console.log("服务器响应:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error saving character:", error);
    if (axios.isAxiosError(error)) {
      console.error("请求配置:", error.config);
      console.error("响应状态:", error.response?.status);
      console.error("响应数据:", error.response?.data);
      
      if (error.response?.status === 500) {
        throw new Error("服务器内部错误，请稍后重试");
      } else if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.message === 'Network Error') {
        throw new Error("网络错误，请检查后端服务是否正常运行");
      }
    }
    throw new Error("保存角色失败，请检查网络连接");
  }
};

// 更新其他 API 函数使用相同的配置
const createAxiosInstance = (token: string) => {
  return axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  });
};

/**
 * 更新已有角色
 */
export const updateCharacter = async (id: string, character: Character): Promise<any> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authorized");

    // 从stats对象中提取属性值
    const { stats, ...otherDetails } = character;
    
    // 创建符合后端API期望的数据结构
    const characterData = {
      ...otherDetails,
      // 直接展开stats对象，使属性值成为顶级字段
      strength: stats.strength,
      dexterity: stats.dexterity,
      constitution: stats.constitution, 
      intelligence: stats.intelligence,
      wisdom: stats.wisdom,
      charisma: stats.charisma
    };

    console.log("发送到服务器的更新数据:", characterData);

    const axiosInstance = createAxiosInstance(token);
    const response = await axiosInstance.put(`/${id}/`, characterData);

    return response.data;
  } catch (error) {
    console.error(`Error updating character ${id}:`, error);
    if (axios.isAxiosError(error)) {
      console.error("请求配置:", error.config);
      console.error("响应状态:", error.response?.status);
      console.error("响应数据:", error.response?.data);
      
      if (error.response?.status === 500) {
        throw new Error("服务器内部错误，请稍后重试");
      } else if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.message === 'Network Error') {
        throw new Error("网络错误，请检查后端服务是否正常运行");
      }
    }
    throw new Error("更新角色失败，请检查网络连接");
  }
};

/**
 * 删除角色
 */
export const deleteCharacter = async (id: string): Promise<void> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authorized");

    const axiosInstance = createAxiosInstance(token);
    await axiosInstance.delete(`/${id}/`);
  } catch (error) {
    console.error(`Error deleting character ${id}:`, error);
    throw error;
  }
};

/**
 * 获取用户角色数量
 */
export const getCharacterCount = async (): Promise<number> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return 0;

    const axiosInstance = createAxiosInstance(token);
    const response = await axiosInstance.get('/count/');
    return response.data.count;
  } catch (error) {
    console.error("Error fetching character count:", error);
    return 0;
  }
};