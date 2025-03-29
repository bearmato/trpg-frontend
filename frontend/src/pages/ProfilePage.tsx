import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getUserProfile, updateUserProfile, Profile } from "../api/auth";
import { useNavigate } from "react-router-dom";
import AvatarUploader from "../components/AvatarUploader";

const ProfilePage: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // 编辑表单状态
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    // 如果未登录，重定向到登录页
    if (!isAuthenticated && !isLoading) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getUserProfile();
        if (profileData) {
          setProfile(profileData);
          setBio(profileData.bio || "");
          setAvatar(profileData.avatar || "");
        }
      } catch (err) {
        setError("获取个人资料失败");
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchProfile();
    }
  }, [isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const updatedProfile = await updateUserProfile({ bio, avatar });
      setProfile(updatedProfile);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "更新个人资料失败");
    }
  };

  const handleAvatarChange = (newAvatarUrl: string) => {
    setAvatar(newAvatarUrl);
    // 如果用户不在编辑模式，自动提交更改
    if (!isEditing) {
      updateUserProfile({ avatar: newAvatarUrl })
        .then((updatedProfile) => {
          setProfile(updatedProfile);
          setError(null);
        })
        .catch((err) => {
          setError(err instanceof Error ? err.message : "更新头像失败");
        });
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-12">
      <div className="max-w-2xl mx-auto bg-base-100 rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-8">个人资料</h1>

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

        {profile && (
          <div className="flex flex-col items-center">
            {/* Avatar uploader component */}
            <AvatarUploader
              currentAvatar={profile.avatar || null}
              onAvatarChange={handleAvatarChange}
            />

            <h2 className="text-2xl font-bold mt-6 mb-2">{profile.username}</h2>
            <p className="text-base-content/70 mb-6">{profile.email}</p>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="w-full max-w-md">
                <div className="form-control mb-6">
                  <label className="label">
                    <span className="label-text">个人简介</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered h-24"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="写一些关于你自己的介绍..."
                  ></textarea>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => setIsEditing(false)}
                  >
                    取消
                  </button>
                  <button type="submit" className="btn btn-primary">
                    保存
                  </button>
                </div>
              </form>
            ) : (
              <div className="w-full">
                <div className="bg-base-200 p-4 rounded-lg mb-6">
                  <h3 className="font-bold mb-2">个人简介</h3>
                  <p>{profile.bio || "暂无个人简介"}</p>
                </div>

                <div className="flex justify-end">
                  <button
                    className="btn btn-primary"
                    onClick={() => setIsEditing(true)}
                  >
                    编辑资料
                  </button>
                </div>
              </div>
            )}

            <div className="divider my-8">账号设置</div>

            <button
              className="btn btn-outline btn-error"
              onClick={handleLogout}
            >
              退出登录
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
