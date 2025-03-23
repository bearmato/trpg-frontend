import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 表单验证
    if (!username || !email || !password || !passwordConfirm) {
      setError("所有字段都必须填写");
      return;
    }

    if (!validateEmail(email)) {
      setError("请输入有效的电子邮箱");
      return;
    }

    if (password !== passwordConfirm) {
      setError("两次输入的密码不匹配");
      return;
    }

    if (password.length < 8) {
      setError("密码长度至少为8个字符");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      await register({ username, email, password });
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "注册失败");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="max-w-md w-full p-6 bg-base-100 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold text-center text-primary mb-8">
          注册账号
        </h1>

        {error && (
          <div className="alert alert-error mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">用户名</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">电子邮箱</span>
            </label>
            <input
              type="email"
              className="input input-bordered w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">密码</span>
            </label>
            <input
              type="password"
              className="input input-bordered w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label className="label">
              <span className="label-text-alt">密码至少8个字符</span>
            </label>
          </div>

          <div className="form-control mb-6">
            <label className="label">
              <span className="label-text">确认密码</span>
            </label>
            <input
              type="password"
              className="input input-bordered w-full"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className={`btn btn-primary w-full ${isLoading ? "loading" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? "注册中..." : "注册"}
          </button>
        </form>

        <div className="text-center mt-6">
          <p>
            已有账号？{" "}
            <Link to="/login" className="text-primary hover:underline">
              登录
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
