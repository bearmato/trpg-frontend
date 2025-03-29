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

// 在 frontend/src/api/characters.ts 中修改 saveCharacter 函数

export const saveCharacter = async (character: Character): Promise<Character> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authorized");

    console.log("发送到服务器的数据:", {
      name: character.name,
      race: character.race,
      subrace: character.subrace,
      character_class: character.character_class,
      subclass: character.subclass,
      level: character.level,
      background: character.background,
      alignment: character.alignment,
      gender: character.gender,
      stats: {
        strength: character.stats.strength,
        dexterity: character.stats.dexterity,
        constitution: character.stats.constitution,
        intelligence: character.stats.intelligence,
        wisdom: character.stats.wisdom,
        charisma: character.stats.charisma
      },
      skill_proficiencies: character.skill_proficiencies,
      features: character.features,
      background_story: character.background_story,
      personality: character.personality,
      ideal: character.ideal,
      bond: character.bond,
      flaw: character.flaw,
      portrait_url: character.portrait_url,
      portrait_public_id: character.portrait_public_id
    });

    const axiosInstance = createAxiosInstance(token);
    const response = await axiosInstance.post('/', {
      name: character.name,
      race: character.race,
      subrace: character.subrace,
      character_class: character.character_class,
      subclass: character.subclass,
      level: character.level,
      background: character.background,
      alignment: character.alignment,
      gender: character.gender,
      stats: {
        strength: character.stats.strength,
        dexterity: character.stats.dexterity,
        constitution: character.stats.constitution,
        intelligence: character.stats.intelligence,
        wisdom: character.stats.wisdom,
        charisma: character.stats.charisma
      },
      skill_proficiencies: character.skill_proficiencies,
      features: character.features,
      background_story: character.background_story,
      personality: character.personality,
      ideal: character.ideal,
      bond: character.bond,
      flaw: character.flaw,
      portrait_url: character.portrait_url,
      portrait_public_id: character.portrait_public_id
    });

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

    const characterData = {
      name: character.name,
      race: character.race,
      subrace: character.subrace,
      character_class: character.character_class,
      subclass: character.subclass,
      level: character.level,
      background: character.background,
      alignment: character.alignment,
      gender: character.gender,
      stats: {
        strength: character.stats.strength,
        dexterity: character.stats.dexterity,
        constitution: character.stats.constitution,
        intelligence: character.stats.intelligence,
        wisdom: character.stats.wisdom,
        charisma: character.stats.charisma
      },
      skill_proficiencies: character.skill_proficiencies,
      features: character.features,
      background_story: character.background_story,
      personality: character.personality,
      ideal: character.ideal,
      bond: character.bond,
      flaw: character.flaw,
      portrait_url: character.portrait_url
    };

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