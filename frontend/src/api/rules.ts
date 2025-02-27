import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api/rules";

export const getRules = async (category: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${category}/`);
    return response.data;
  } catch (error) {
    console.error("❌ 获取规则失败:", error);
    return [];
  }
};

export const getRuleDetail = async (category: string, index: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${category}/${index}/`);
    return response.data;
  } catch (error) {
    console.error("❌ 获取规则详情失败:", error);
    return null;
  }
};