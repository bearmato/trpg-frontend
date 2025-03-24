import axios from "axios";

const API_BASE_URL = "https://trpg-backend-production-fb60.up.railway.app";
//const API_BASE_URL = "http://127.0.0.1:8000";  



export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Profile {
  id: number;
  username: string;
  email: string;
  avatar: string | null;
  bio: string;
  created_at: string;
}

// 注册新用户
export const registerUser = async (userData: RegisterData): Promise<AuthResponse> => {
  try {
    console.log("发送注册请求数据:", userData);
    console.log("请求URL:", `${API_BASE_URL}/api/auth/register/`);
    
    const response = await axios.post(`${API_BASE_URL}/api/auth/register/`, userData);
    
    console.log("注册成功，响应数据:", response.data);
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
    return response.data;
  } catch (error) {
    console.error("注册失败，详细错误:", error);
    if (axios.isAxiosError(error) && error.response) {
      console.error("服务器响应:", error.response.data);
      console.error("状态码:", error.response.status);
      throw new Error(
        typeof error.response.data === 'string' 
          ? error.response.data 
          : JSON.stringify(error.response.data) || "注册失败"
      );
    }
    throw new Error("无法连接到服务器");
  }
};

// 用户登录
export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/login/`, credentials);
    // 保存令牌到localStorage
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "登录失败，请检查用户名和密码");
    }
    throw new Error("无法连接到服务器");
  }
};

// 登出用户
export const logoutUser = async (): Promise<void> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;

    await axios.post(
      `${API_BASE_URL}/api/auth/logout/`,
      {},
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );
    
    // 清除本地存储的认证信息
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  } catch (error) {
    console.error("登出时出错:", error);
  }
};

// 获取当前用户信息
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const response = await axios.get(`${API_BASE_URL}/api/auth/user/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
      // 认证失败，清除过期令牌
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    return null;
  }
};

// 获取用户个人资料
export const getUserProfile = async (): Promise<Profile | null> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const response = await axios.get(`${API_BASE_URL}/api/auth/profile/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("获取个人资料失败:", error);
    return null;
  }
};

// 更新用户个人资料
export const updateUserProfile = async (profileData: Partial<Profile>): Promise<Profile> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("未授权");

    const response = await axios.patch(
      `${API_BASE_URL}/api/auth/profile/`,
      profileData,
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "更新个人资料失败");
    }
    throw new Error("无法连接到服务器");
  }
};