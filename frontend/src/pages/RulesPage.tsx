import { useState, useEffect } from "react";
import { getRules } from "../api/rules";
import { Link } from "react-router-dom";

const categories = ["spells", "monsters", "equipment", "classes", "races"];

const RulesPage = () => {
  const [category, setCategory] = useState("spells");
  const [rules, setRules] = useState<{ index: string; name: string }[]>([]);

  useEffect(() => {
    getRules(category).then((data) => setRules(data.results || []));
  }, [category]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">规则查询</h1>
      <div className="tabs">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`tab ${category === cat ? "tab-active" : ""}`}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <ul className="mt-4">
        {rules.map((rule) => (
          <li key={rule.index} className="p-2 border-b">
            <Link
              to={`/rules/${category}/${rule.index}`}
              className="text-blue-500"
            >
              {rule.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RulesPage;
