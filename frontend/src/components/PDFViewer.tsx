// frontend/src/components/PDFViewer.tsx
import React, { useState } from "react";
import { getPDFViewUrl } from "../api/rules";

interface PDFViewerProps {
  filename: string;
  title: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ filename, title }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [zoom, setZoom] = useState<number>(100);

  const pdfUrl = getPDFViewUrl(filename);

  // 处理PDF下载
  const handleDownload = () => {
    window.open(pdfUrl, "_blank");
  };

  // 在新标签页中打开PDF
  const openInNewTab = () => {
    window.open(pdfUrl, "_blank");
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* 工具栏 */}
      <div className="bg-gray-100 p-3 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center">
          <button
            onClick={() => setZoom(Math.max(50, zoom - 25))}
            className="btn btn-sm btn-ghost"
            disabled={zoom <= 50 || hasError}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 12H4"
              />
            </svg>
          </button>

          <span className="mx-2 text-sm">{zoom}%</span>

          <button
            onClick={() => setZoom(Math.min(200, zoom + 25))}
            className="btn btn-sm btn-ghost"
            disabled={zoom >= 200 || hasError}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>

          <button
            onClick={() => setZoom(100)}
            className="btn btn-sm btn-ghost ml-2"
            disabled={hasError}
          >
            重置
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button onClick={openInNewTab} className="btn btn-sm btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            <span className="ml-1 hidden sm:inline">在新标签页中打开</span>
          </button>

          <button onClick={handleDownload} className="btn btn-sm btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            <span className="ml-1 hidden sm:inline">下载</span>
          </button>
        </div>
      </div>

      {/* PDF内容区 */}
      <div className="flex-1 bg-gray-200 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/80">
            <div className="flex flex-col items-center">
              <span className="loading loading-spinner text-[#A31D1D]"></span>
              <span className="mt-2 text-sm">加载PDF中...</span>
            </div>
          </div>
        )}

        {hasError ? (
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-lg max-w-md text-center shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto text-red-500 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <h3 className="text-lg font-bold mb-2">无法加载PDF预览</h3>
              <p className="mb-4">
                由于技术限制，暂时无法直接预览PDF。您可以尝试以下选项：
              </p>
              <div className="flex flex-col gap-2">
                <button onClick={openInNewTab} className="btn btn-primary">
                  在新标签页中打开
                </button>
                <button onClick={handleDownload} className="btn btn-outline">
                  下载PDF
                </button>
              </div>
            </div>
          </div>
        ) : (
          // 尝试使用iframe嵌入PDF
          <iframe
            src={pdfUrl}
            className="w-full h-full border-none"
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: "top center",
            }}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
            }}
            title={title}
          />
        )}
      </div>
    </div>
  );
};

export default PDFViewer;
