import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRuleDetail } from "../api/rules";

const RuleDetailPage = () => {
  const { category, ruleName } = useParams<{
    category: string;
    ruleName: string;
  }>();
  const [rule, setRule] = useState<{ name: string; desc: string[] } | null>(
    null
  );

  useEffect(() => {
    if (category && ruleName) {
      getRuleDetail(category, ruleName).then(setRule);
    }
  }, [category, ruleName]);

  return rule ? (
    <div className="p-6">
      <h1 className="text-3xl font-bold">{rule.name}</h1>
      <p className="mt-4">
        {rule.desc ? rule.desc.join(" ") : "No description available."}
      </p>
    </div>
  ) : (
    <p>加载中...</p>
  );
};

export default RuleDetailPage;
