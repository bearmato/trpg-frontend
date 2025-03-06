// frontend/src/components/PDFViewer.tsx
import React, { useState } from "react";
import { getPDFViewUrl } from "../api/rules";

interface PDFViewerProps {
  filename: string;
  title: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ filename, title }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pdfUrl = getPDFViewUrl(filename);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="bg-base-200 p-2 flex justify-between items-center shadow-sm">
        <h2 className="text-lg font-bold">{title}</h2>
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-sm btn-primary"
          download={filename}
        >
          下载PDF
        </a>
      </div>

      <div className="flex-1 bg-base-300 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-error text-error-content p-4 rounded-lg">
              {error}
            </div>
          </div>
        )}

        <iframe
          src={pdfUrl}
          className="w-full h-full border-none"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setError("加载PDF失败。请尝试直接下载。");
          }}
          title={title}
        />
      </div>
    </div>
  );
};

export default PDFViewer;
