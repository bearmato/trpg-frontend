import React, { useState, KeyboardEvent, useRef } from "react";

interface KeywordInputProps {
  value: string[];
  onChange: (keywords: string[]) => void;
}

const KeywordInput: React.FC<KeywordInputProps> = ({ value, onChange }) => {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // 预设的关键词选项
  const suggestions = [
    "mysterious past",
    "orphan",
    "royal lineage",
    "forest dweller",
    "outcast",
    "cursed",
    "prophecy",
    "revenge",
    "mentor",
    "hidden identity",
    "scholar",
    "traveler",
    "village hero",
    "war veteran",
    "seeking redemption",
  ];

  const addKeyword = (keyword: string) => {
    keyword = keyword.trim();
    if (keyword && !value.includes(keyword)) {
      onChange([...value, keyword]);
    }
    setInputValue("");
    // 添加后让输入框重新获得焦点
    inputRef.current?.focus();
  };

  const removeKeyword = (keyword: string) => {
    onChange(value.filter((k) => k !== keyword));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addKeyword(inputValue);
    }
  };

  // 过滤已选择的关键词，不在建议中显示
  const filteredSuggestions = suggestions.filter((s) => !value.includes(s));

  return (
    <div className="space-y-3">
      {/* 输入框和已选择的标签 */}
      <div className="flex flex-wrap gap-2 p-2 bg-base-200 rounded-lg border border-base-300 min-h-12">
        {value.map((keyword) => (
          <div
            key={keyword}
            className="bg-primary/10 text-primary px-2 py-1 rounded-full flex items-center"
          >
            <span>{keyword}</span>
            <button
              type="button"
              onClick={() => removeKeyword(keyword)}
              className="ml-1 text-primary hover:text-primary-focus"
            >
              ×
            </button>
          </div>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-grow min-w-[200px] bg-transparent border-none focus:outline-none p-1"
          placeholder={
            value.length > 0
              ? "Add more keywords..."
              : "Type a keyword and press Enter..."
          }
        />
      </div>

      {/* 关键词建议区域 - 始终显示 */}
      <div className="mt-2">
        <div className="text-sm text-base-content/70 mb-2">
          Suggested keywords (click to add):
        </div>
        <div className="flex flex-wrap gap-2">
          {filteredSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => addKeyword(suggestion)}
              className="px-3 py-1 bg-base-200 hover:bg-base-300 rounded-full text-sm transition-colors"
            >
              {suggestion}
            </button>
          ))}
          {filteredSuggestions.length === 0 && (
            <span className="text-sm text-base-content/50 italic">
              All suggestions have been added
            </span>
          )}
        </div>
      </div>

      <div className="text-xs text-base-content/60">
        {value.length === 0
          ? "Click a suggestion or type and press Enter to add keywords"
          : `${value.length} keyword${value.length !== 1 ? "s" : ""} selected`}
      </div>
    </div>
  );
};

export default KeywordInput;
