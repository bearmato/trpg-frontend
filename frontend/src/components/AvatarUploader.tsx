import React, { useState, useRef } from "react";
import axios from "axios";

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

      // 修改请求路径以匹配后端路径
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/upload-avatar/`, // 修改这里的路径
        formData,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "multipart/form-data",
          },
          // 添加 withCredentials 配置
          withCredentials: true,
        }
      );

      console.log("Upload response:", response.data);

      // Call the callback with the new avatar URL
      if (response.data && response.data.avatar_url) {
        onAvatarChange(response.data.avatar_url);
      } else if (
        response.data &&
        response.data.profile &&
        response.data.profile.avatar
      ) {
        // 兼容处理不同的返回格式
        onAvatarChange(response.data.profile.avatar);
      }
    } catch (error) {
      console.error("Avatar upload failed:", error);
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

  // Function to remove avatar and set to default
  const removeAvatar = async () => {
    try {
      setIsUploading(true);
      const token = localStorage.getItem("token");

      // 修改路径以匹配后端实际路径
      await axios.post(
        `${API_BASE_URL}/api/auth/avatar/remove/`,
        {},
        {
          headers: {
            Authorization: `Token ${token}`,
          },
          withCredentials: true,
        }
      );

      // Update state and call callback
      setPreviewUrl(null);
      onAvatarChange("");
    } catch (error) {
      // 改进错误处理
      console.error("Failed to remove avatar:", error);
      if (axios.isAxiosError(error)) {
        setUploadError(
          `删除头像失败: ${error.response?.data?.message || error.message}`
        );
      } else {
        setUploadError("删除头像失败，请稍后重试");
      }
    } finally {
      setIsUploading(false);
    }
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

          {/* Overlay with upload icon on hover */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            onClick={triggerFileInput}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
          </div>
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

        {previewUrl && (
          <button
            type="button"
            className="btn btn-outline btn-error btn-sm"
            onClick={removeAvatar}
            disabled={isUploading}
          >
            Remove
          </button>
        )}
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
