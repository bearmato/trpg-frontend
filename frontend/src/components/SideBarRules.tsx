//import { useState } from "react";

interface SideBarRulesProps {
  categories: string[];
  selectedCategory: string | null;
  setCategory: (category: string | null) => void; // ✅ 允许 null
  rules: { index: string; name: string }[];
  onRuleClick: (ruleIndex: string) => void;
}

const SideBarRules = ({
  categories,
  selectedCategory,
  setCategory,
  rules,
  onRuleClick,
}: SideBarRulesProps) => {
  return (
    <div className="w-64 bg-gray-800 text-white p-4 h-full overflow-auto">
      <h2 className="text-xl font-bold mb-4">📚 规则查询</h2>
      <ul>
        {categories.map((category) => (
          <li key={category} className="mb-2">
            {/* 选择大类 */}
            <button
              className={`w-full text-left font-semibold p-2 rounded-lg cursor-pointer ${
                selectedCategory === category
                  ? "bg-gray-700"
                  : "hover:bg-gray-700"
              }`}
              onClick={() =>
                setCategory(selectedCategory === category ? null : category)
              } // ✅ 修正 setCategory 逻辑
            >
              {category.toUpperCase()}{" "}
              {selectedCategory === category ? "▲" : "▼"}
            </button>

            {/* 展开子类列表 */}
            {selectedCategory === category && (
              <ul className="ml-4 mt-2">
                {rules.length > 0 ? (
                  rules.map((rule) => (
                    <li key={rule.index}>
                      <button
                        className="text-left w-full p-2 hover:bg-gray-600 rounded-md cursor-pointer"
                        onClick={() => onRuleClick(rule.index)}
                      >
                        {rule.name}
                      </button>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm p-2">暂无数据</p>
                )}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SideBarRules;
