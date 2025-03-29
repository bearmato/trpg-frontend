import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  User,
  getCurrentUser,
  loginUser,
  registerUser,
  logoutUser,
  LoginCredentials,
  RegisterData,
  getUserProfile,
} from "../api/auth";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  updateUser: (updatedUserData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 检查用户是否已经登录
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        let parsedUser = null;
        const token = localStorage.getItem("token");

        console.log("AuthContext: 开始检查认证状态");

        if (!token) {
          console.log("AuthContext: 无令牌，用户未登录");
          setIsLoading(false);
          return;
        }

        // 首先尝试从localStorage获取用户信息
        if (storedUser) {
          try {
            parsedUser = JSON.parse(storedUser);
            console.log(
              "AuthContext: localStorage中找到用户，头像:",
              parsedUser.avatar
            );

            // 确保avatar属性存在
            if (!("avatar" in parsedUser)) {
              parsedUser.avatar = "";
              console.log("AuthContext: 添加缺失的avatar属性");
            }

            // 先设置用户，确保界面能快速响应
            setUser(parsedUser);
          } catch (parseError) {
            console.error("解析本地用户信息失败:", parseError);
            localStorage.removeItem("user");
          }
        } else {
          console.log("AuthContext: localStorage中没有用户信息");
        }

        // 然后验证令牌并获取最新用户信息
        console.log("AuthContext: 从API获取最新用户信息");
        const currentUser = await getCurrentUser();

        if (currentUser) {
          console.log(
            "AuthContext: API返回用户信息，头像:",
            currentUser.avatar
          );

          // 确保有avatar属性
          if (!("avatar" in currentUser)) {
            currentUser.avatar = "";
            console.log("AuthContext: API返回的用户没有avatar属性，已添加");
          }

          // 获取完整的用户资料信息
          try {
            const profileData = await getUserProfile();
            if (profileData && profileData.avatar) {
              console.log(
                "AuthContext: 从profile获取到头像:",
                profileData.avatar
              );
              currentUser.avatar = profileData.avatar;
            }
          } catch (profileError) {
            console.error("获取用户资料失败:", profileError);
          }

          // 更新用户状态和localStorage
          console.log("AuthContext: 更新用户状态，头像:", currentUser.avatar);
          setUser(currentUser);
          localStorage.setItem("user", JSON.stringify(currentUser));
        } else {
          console.log("AuthContext: API未返回有效用户，清除认证信息");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        }
      } catch (err) {
        console.error("Auth check error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // 更新用户信息
  const updateUser = (updatedUserData: Partial<User>) => {
    setUser((prevUser) => {
      if (!prevUser) return null;

      // 合并现有用户数据和更新数据
      const newUser = { ...prevUser, ...updatedUserData };

      // 处理头像
      if (updatedUserData.avatar !== undefined) {
        if (updatedUserData.avatar) {
          // 保持头像URL不变
          newUser.avatar = updatedUserData.avatar;
        } else {
          newUser.avatar = "";
        }
      }

      // 更新本地存储
      localStorage.setItem("user", JSON.stringify(newUser));

      return newUser;
    });
  };

  // 登录
  const login = async (credentials: LoginCredentials) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await loginUser(credentials);

      // 确保用户对象中有avatar属性，即使为空字符串
      if (!("avatar" in response.user)) {
        response.user.avatar = "";
        console.log("登录时添加空的avatar属性");
      } else if (response.user.avatar) {
        console.log("登录成功，用户头像:", response.user.avatar);
      }

      // 设置用户状态
      setUser(response.user);

      // 确保本地存储的用户信息完整
      localStorage.setItem("user", JSON.stringify(response.user));
    } catch (err) {
      setError(err instanceof Error ? err.message : "登录失败");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // 注册
  const register = async (data: RegisterData) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await registerUser(data);
      setUser(response.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "注册失败");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // 登出
  const logout = async () => {
    setIsLoading(true);

    try {
      await logoutUser();
      setUser(null);
    } catch (err) {
      console.error("登出失败:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    error,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
