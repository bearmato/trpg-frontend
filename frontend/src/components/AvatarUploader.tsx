import React, { useState, useRef } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

interface AvatarUploaderProps {
  currentAvatar: string | null;
  onAvatarChange: (url: string) => void;
  defaultAvatar?: string; // Default avatar URL
}

const AvatarUploader: React.FC<AvatarUploaderProps> = ({
  currentAvatar,
  onAvatarChange,
  defaultAvatar = "/images/avatars/default-avatar.png", // Default avatar path
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatar);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { updateUser } = useAuth(); // 从AuthContext获取updateUser方法

  // 修正 API URL 地址
  const API_BASE_URL = "https://trpg-backend-production-fb60.up.railway.app";

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file.");
      return;
    }

    // Validate file size (3MB max)
    if (file.size > 3 * 1024 * 1024) {
      setUploadError("Image size should not exceed 3MB.");
      return;
    }

    // Create a preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Prepare to upload
    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const token = localStorage.getItem("token");

      // 上传头像
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/upload-avatar/`,
        formData,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      // 提取头像URL
      let avatarUrl = "";
      if (response.data && response.data.avatar_url) {
        avatarUrl = response.data.avatar_url;
      } else if (
        response.data &&
        response.data.profile &&
        response.data.profile.avatar
      ) {
        avatarUrl = response.data.profile.avatar;
      } else if (response.data && response.data.avatar) {
        avatarUrl = response.data.avatar;
      }

      // 尝试从响应中解析URL
      if (!avatarUrl) {
        const responseStr = JSON.stringify(response.data);
        const urlMatch = responseStr.match(
          /(https?:\/\/[^"']+\.(jpg|jpeg|png|gif))/i
        );
        if (urlMatch && urlMatch[0]) {
          avatarUrl = urlMatch[0];
        }
      }

      if (avatarUrl) {
        // 更新全局用户状态
        updateUser({ avatar: avatarUrl });

        // 更新当前组件状态
        onAvatarChange(avatarUrl);

        // 刷新页面
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        setUploadError("上传成功但无法获取头像URL");
      }
    } catch (error) {
      console.error("AvatarUploader: 头像上传失败:", error);
      // 改进错误提示
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          setUploadError("未授权，请重新登录");
        } else if (error.code === "ERR_NETWORK") {
          setUploadError("网络错误，请检查你的网络连接");
        } else {
          setUploadError(
            `上传失败: ${error.response?.data?.message || error.message}`
          );
        }
      } else {
        setUploadError("上传失败，请稍后重试");
      }
      setPreviewUrl(currentAvatar);
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle image loading error - show default avatar
  const handleImageError = () => {
    setPreviewUrl(null);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Avatar preview */}
      <div className="relative group">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary bg-base-200 flex items-center justify-center">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Avatar Preview"
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
          ) : defaultAvatar ? (
            <img
              src={defaultAvatar}
              alt="Default Avatar"
              className="w-full h-full object-cover"
              onError={() => console.error("Default avatar failed to load")}
            />
          ) : (
            <div className="text-4xl opacity-30">👤</div>
          )}
        </div>
      </div>

      {/* Upload/Remove buttons */}
      <div className="flex gap-2">
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={triggerFileInput}
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Uploading...
            </>
          ) : (
            "Change Avatar"
          )}
        </button>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />

      {/* Error message */}
      {uploadError && (
        <div className="text-sm text-error mt-2">{uploadError}</div>
      )}

      <p className="text-xs text-base-content/60 text-center max-w-xs">
        Click on the avatar or button to upload an image. Supported formats:
        JPG, PNG, GIF. Max size: 3MB.
      </p>
    </div>
  );
};

export default AvatarUploader;
