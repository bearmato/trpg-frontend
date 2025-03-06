// frontend/src/pages/RulesPage.tsx
import React, { useState, useEffect } from "react";
import { getRuleBooks, RuleBook, getPDFViewUrl } from "../api/rules";
import PDFViewer from "../components/PDFViewer";

const RulesPage: React.FC = () => {
  // 状态管理
  const [rulebooks, setRulebooks] = useState<RuleBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBook, setSelectedBook] = useState<RuleBook | null>(null);

  // 加载规则书数据
  useEffect(() => {
    const fetchRuleBooks = async () => {
      try {
        setIsLoading(true);
        const categories = await getRuleBooks();

        // 将所有分类的书籍合并到一个数组中
        const allBooks = categories.flatMap((category) => category.books);
        setRulebooks(allBooks);

        // 默认选中第一本书（如果有的话）
        if (allBooks.length > 0) {
          setSelectedBook(allBooks[0]);
        }
      } catch (err) {
        console.error("获取规则书失败:", err);
        setError("无法加载规则书。请稍后再试。");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRuleBooks();
  }, []);

  // 计算文件大小的友好显示
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="min-h-screen bg-[#FAF6E9]">
      {/* 渐变Hero Section */}
      <div className="bg-gradient-to-b from-[#A31D1D] via-[#C73E3E] to-[#FAF6E9] py-20 mb-8">
        <div className="container mx-auto max-w-6xl px-4 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">
            D&D 5e Rulebooks
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Access official Dungeons & Dragons rulebooks to enhance your
            adventures
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 pb-16">
        {isLoading ? (
          <div className="flex justify-center items-center h-64 bg-[#FAF6E9] rounded-lg">
            <div className="flex flex-col items-center">
              <span className="loading loading-spinner loading-lg text-[#A31D1D]"></span>
              <span className="mt-4 text-[#5C3A21]">加载规则书中...</span>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-error max-w-md mx-auto">
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
        ) : (
          <div className="bg-[#FAF6E9] rounded-lg p-6 shadow-md">
            {/* 核心规则书标题 */}
            <h2 className="text-2xl font-bold text-[#8B0000] mb-6">
              核心规则书
            </h2>

            {/* 规则书卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {rulebooks.map((book) => (
                <div
                  key={book.filename}
                  className={`p-5 rounded-lg cursor-pointer transition-all border shadow-sm hover:shadow-md ${
                    selectedBook?.filename === book.filename
                      ? "bg-[#A31D1D] text-white border-[#A31D1D]"
                      : "bg-[#E5DCC3] hover:bg-[#D3C9A3] text-[#5C3A21] border-[#D3C9A3]"
                  }`}
                  onClick={() => setSelectedBook(book)}
                >
                  <h3 className="font-bold text-lg">{book.title}</h3>
                  <p
                    className={`mt-3 line-clamp-2 ${
                      selectedBook?.filename === book.filename
                        ? "text-white/80"
                        : "text-[#5C3A21]/80"
                    }`}
                  >
                    {book.description}
                  </p>
                  <div
                    className={`mt-4 text-sm ${
                      selectedBook?.filename === book.filename
                        ? "text-white/70"
                        : "text-[#5C3A21]/60"
                    }`}
                  >
                    {formatFileSize(book.size)}
                  </div>
                </div>
              ))}
            </div>

            {/* PDF查看器 */}
            {selectedBook && (
              <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-100">
                <div className="bg-[#A31D1D] text-white p-4 flex justify-between items-center">
                  <h2 className="text-xl font-bold">{selectedBook.title}</h2>
                  <a
                    href={getPDFViewUrl(selectedBook.filename)}
                    download={selectedBook.filename}
                    className="btn bg-white hover:bg-white/90 text-[#A31D1D] border-none"
                  >
                    View PDF
                  </a>
                </div>
                <div className="p-4 bg-gray-100 border-b border-gray-200">
                  <p>{selectedBook.description}</p>
                </div>
                <div className="h-[600px]">
                  <PDFViewer
                    filename={selectedBook.filename}
                    title={selectedBook.title}
                  />
                </div>
              </div>
            )}

            {/* 页脚说明 */}
            <div className="mt-10 p-5 bg-[#E5DCC3] rounded-lg text-sm text-[#5C3A21] shadow-sm">
              <p className="mb-3">
                这些规则书仅供参考。官方规则和内容由Wizards of the Coast发布。
                更多资源，请访问
                <a
                  href="https://dnd.wizards.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#A31D1D] hover:underline ml-1"
                >
                  官方D&D网站
                </a>
                。
              </p>
              <p className="text-xs text-[#5C3A21]/70">
                D&D 5e规则书是Wizards of the Coast的知识产权。
                这些PDF版本仅供参考。
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RulesPage;
