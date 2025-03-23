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
} from "../api/auth";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
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
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        // 验证令牌有效性
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (err) {
        console.error("Auth check error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // 登录
  const login = async (credentials: LoginCredentials) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await loginUser(credentials);
      setUser(response.user);
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
