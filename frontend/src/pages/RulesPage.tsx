import { useState, useEffect } from "react";
import { getRules, getRuleDetail } from "../api/rules"; // ✅ API 请求
import SideBarRules from "../components/SideBarRules"; // ✅ 侧边栏
import RulesDetailPage from "../pages/RulesDetailPage"; // ✅ 详情页面

const categories = ["spells", "monsters", "equipment", "classes", "races"];

const RulesPage = () => {
  const [category, setCategory] = useState<string | null>(null); // ✅ 允许 null
  const [rules, setRules] = useState<{ index: string; name: string }[]>([]);
  const [selectedRule, setSelectedRule] = useState<{
    name: string;
    desc: string;
  } | null>(null);

  useEffect(() => {
    if (category) {
      getRules(category).then((data) => {
        console.log(`📌 获取到 ${category} 数据:`, data);
        setRules(data.results || []);
      });
    }
  }, [category]);

  const handleRuleClick = (ruleIndex: string) => {
    if (category) {
      getRuleDetail(category, ruleIndex).then((data) => {
        console.log(`📌 规则详情(${ruleIndex}):`, data);
        setSelectedRule({
          name: data.name,
          desc: data.desc?.join("\n\n") || "暂无描述",
        });
      });
    }
  };

  return (
    <div className="flex h-screen">
      {/* 侧边栏 */}
      <SideBarRules
        categories={categories}
        selectedCategory={category}
        setCategory={setCategory} // ✅ 传递允许 null 的 setCategory
        rules={rules}
        onRuleClick={handleRuleClick}
      />

      {/* 规则详情 */}
      <div className="flex-1 p-6 overflow-auto">
        {selectedRule ? (
          <RulesDetailPage rule={selectedRule} />
        ) : (
          <p className="text-center text-gray-500">🔍 请选择一个规则查看详情</p>
        )}
      </div>
    </div>
  );
};

export default RulesPage;
