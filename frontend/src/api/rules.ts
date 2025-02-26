import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api";

/**
 * 获取指定类别的规则列表
 */
export const getRules = async (category: string) => {
  const response = await axios.get(`${API_BASE_URL}/rules/${category}/`);
  return response.data;
};

/**
 * 获取单个规则详情
 */
export const getRuleDetail = async (category: string, ruleName: string) => {
  const response = await axios.get(`${API_BASE_URL}/rules/${category}/${ruleName}/`);
  return response.data;
};