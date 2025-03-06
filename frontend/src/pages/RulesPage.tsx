// frontend/src/pages/RulesPage.tsx
import React, { useState, useEffect } from "react";
import { getRuleBooks, RuleBook, RuleCategory } from "../api/rules";
import PDFViewer from "../components/PDFViewer";

const RulesPage: React.FC = () => {
  // 状态管理
  const [categories, setCategories] = useState<RuleCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBook, setSelectedBook] = useState<RuleBook | null>(null);

  // 加载规则书数据
  useEffect(() => {
    const fetchRuleBooks = async () => {
      try {
        setIsLoading(true);
        const data = await getRuleBooks();
        setCategories(data);

        // 默认选中第一个分类（如果有的话）
        if (data.length > 0) {
          setSelectedCategory(data[0].id);
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

  // 处理分类点击
  const handleCategoryClick = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryId);
    }
    // 重置选中的书
    setSelectedBook(null);
  };

  // 处理书籍点击
  const handleBookClick = (book: RuleBook) => {
    setSelectedBook(book);
  };

  // 获取当前显示的书籍列表
  const getDisplayedBooks = () => {
    if (!selectedCategory) return [];
    const category = categories.find((c) => c.id === selectedCategory);
    return category ? category.books : [];
  };

  // 计算文件大小的友好显示
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="min-h-screen bg-base-100 p-4 md:p-8">
      <div className="container mx-auto">
        {/* 页面标题 */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-primary">D&D 5e 规则书</h1>
          <p className="mt-2 text-lg">浏览和查阅官方D&D第五版规则书</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* 左侧目录区域 */}
          <div className="lg:w-1/3">
            <div className="bg-base-200 p-4 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4 border-b pb-2">
                规则书分类
              </h2>

              {isLoading ? (
                <div className="flex justify-center py-8">
                  <span className="loading loading-spinner loading-md"></span>
                </div>
              ) : error ? (
                <div className="alert alert-error">{error}</div>
              ) : (
                <div className="space-y-4">
                  {categories.map((category) => (
                    <div key={category.id} className="category">
                      <button
                        className={`flex justify-between items-center w-full p-3 rounded-lg text-left font-medium transition-colors ${
                          selectedCategory === category.id
                            ? "bg-primary text-primary-content"
                            : "bg-base-100 hover:bg-base-300"
                        }`}
                        onClick={() => handleCategoryClick(category.id)}
                      >
                        <span>{category.name}</span>
                        <span>
                          {selectedCategory === category.id ? "-" : "+"}
                        </span>
                      </button>

                      {selectedCategory === category.id && (
                        <div className="mt-2 space-y-1 pl-4">
                          {category.books.length > 0 ? (
                            category.books.map((book) => (
                              <button
                                key={book.filename}
                                className={`block w-full text-left p-2 rounded transition-colors ${
                                  selectedBook?.filename === book.filename
                                    ? "bg-secondary/20 font-medium"
                                    : "hover:bg-base-300"
                                }`}
                                onClick={() => handleBookClick(book)}
                              >
                                {book.title}
                              </button>
                            ))
                          ) : (
                            <p className="text-sm text-base-content/70 p-2">
                              该分类下暂无规则书
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}

                  {categories.length === 0 && (
                    <div className="alert alert-info">
                      未找到规则书。请确保PDF文件已正确放置在后端服务器中。
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-6 p-4 bg-base-200 rounded-lg shadow">
              <h3 className="font-bold mb-2">关于规则书</h3>
              <p className="text-sm">
                这些规则书仅供参考。官方规则和内容以Wizards of the
                Coast出版的书籍为准。 更多资源请访问{" "}
                <a
                  href="https://dnd.wizards.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link link-primary"
                >
                  Wizards of the Coast官方网站
                </a>
                。
              </p>
            </div>
          </div>

          {/* 右侧内容区域 */}
          <div className="lg:w-2/3">
            {selectedBook ? (
              <div className="bg-base-100 rounded-lg shadow border border-base-300">
                {/* 书籍详情和PDF查看器 */}
                <div className="p-4 border-b">
                  <h2 className="text-2xl font-bold text-primary">
                    {selectedBook.title}
                  </h2>
                  <p className="mt-2 text-base-content/80">
                    {selectedBook.description}
                  </p>

                  <div className="mt-3 text-sm text-base-content/60">
                    文件大小: {formatFileSize(selectedBook.size)}
                  </div>
                </div>

                {/* PDF查看器 */}
                <div className="h-[600px]">
                  <PDFViewer
                    filename={selectedBook.filename}
                    title={selectedBook.title}
                  />
                </div>
              </div>
            ) : (
              <div className="bg-base-100 rounded-lg shadow border border-base-300 p-8 flex flex-col items-center justify-center min-h-[400px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-base-content/30 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-center mb-2">
                  选择一本规则书
                </h3>
                <p className="text-center max-w-md text-base-content/70">
                  从左侧列表中选择一个分类和规则书进行查看。
                  您可以在浏览器中直接阅读PDF文件,也可以下载到本地。
                </p>

                {/* 快速访问 */}
                {categories.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-center mb-3">热门规则书</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {categories
                        .flatMap((category) => category.books)
                        .slice(0, 3)
                        .map((book) => (
                          <button
                            key={book.filename}
                            className="btn btn-outline"
                            onClick={() => {
                              // 找到并选中该书所在的分类
                              const category = categories.find((c) =>
                                c.books.some(
                                  (b) => b.filename === book.filename
                                )
                              );
                              if (category) {
                                setSelectedCategory(category.id);
                                setSelectedBook(book);
                              }
                            }}
                          >
                            {book.title}
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 底部说明 */}
        <div className="mt-10 text-center text-sm text-base-content/60 max-w-2xl mx-auto">
          <p>
            D&D 5e规则书的知识产权归Wizards of the Coast所有。
            这些PDF版本仅供参考。获取官方资料,请访问
            <a
              href="https://dnd.wizards.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="link link-primary ml-1"
            >
              官方D&D网站
            </a>
            。
          </p>
        </div>
      </div>
    </div>
  );
};

export default RulesPage;
