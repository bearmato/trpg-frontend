import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getUserProfile, updateUserProfile, Profile } from "../api/auth";
import { useNavigate } from "react-router-dom";
import AvatarUploader from "../components/AvatarUploader";

const ProfilePage: React.FC = () => {
  const { isAuthenticated, logout, updateUser } = useAuth();
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
        setError("Failed to get profile");
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
      // 更新全局用户状态
      updateUser({ avatar });
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update profile failed");
    }
  };

  const handleAvatarChange = (newAvatarUrl: string) => {
    console.log("ProfilePage: Received new avatar URL:", newAvatarUrl);
    setAvatar(newAvatarUrl);

    // 如果用户不在编辑模式，自动提交更改
    if (!isEditing) {
      console.log(
        "ProfilePage: Automatically submitting avatar change to server"
      );

      // 不要在这里修改URL，保持原样传递给API
      updateUserProfile({ avatar: newAvatarUrl })
        .then((updatedProfile) => {
          setProfile(updatedProfile);
          // 更新全局用户状态，确保导航栏头像也更新
          console.log(
            "ProfilePage: Updating global user state, new avatar:",
            newAvatarUrl
          );

          // 直接使用API返回的avatar值，避免二次修改URL
          if (updatedProfile && updatedProfile.avatar) {
            updateUser({ avatar: updatedProfile.avatar });
          } else {
            updateUser({ avatar: newAvatarUrl });
          }

          setError(null);
        })
        .catch((err) => {
          console.error("ProfilePage: Failed to update avatar:", err);
          setError(
            err instanceof Error ? err.message : "Failed to update avatar"
          );
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
        <h1 className="text-3xl font-bold text-center mb-8">
          Personal Profile
        </h1>

        {error && (
          <div className="alert alert-error mb-6 max-w-lg mx-auto">
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
              <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto">
                <div className="form-control mb-6">
                  <textarea
                    className="textarea textarea-bordered h-40 text-base focus:outline-primary w-full"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Write something about yourself..."
                  ></textarea>
                  <label className="label">
                    <span className="label-text-alt text-base-content/60">
                      You can share your interests, hobbies, or TRPG experiences
                    </span>
                  </label>
                </div>

                <div className="flex justify-center gap-5 mt-8">
                  <button
                    type="button"
                    className="btn btn-outline min-w-[100px]"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary min-w-[100px]"
                  >
                    Save
                  </button>
                </div>
              </form>
            ) : (
              <div className="w-full max-w-lg mx-auto">
                <div className="rounded-lg mb-6">
                  <div className="flex items-center justify-center mb-2">
                    <h3 className="font-bold text-lg">Personal Profile</h3>
                  </div>
                  <div className="bg-base-200 p-5 rounded-lg">
                    {profile.bio ? (
                      <p className="whitespace-pre-wrap">{profile.bio}</p>
                    ) : (
                      <p className="text-base-content/50 italic text-center">
                        No personal profile yet
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-center">
                  <button
                    className="btn btn-primary min-w-[120px]"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            )}

            <div className="divider my-8"></div>

            <button
              className="btn btn-outline btn-error min-w-[120px] mt-4"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
