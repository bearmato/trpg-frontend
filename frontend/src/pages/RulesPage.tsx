import { useState, useEffect } from "react";
import { getRules, getRuleDetail } from "../api/rules";
import SideBarRules from "../components/SideBarRules";
import RulesDetailPage from "../pages/RulesDetailPage";

const categories = ["spells", "monsters", "equipment", "classes", "races"];

const RulesPage = () => {
  const [category, setCategory] = useState<string | null>(null);
  const [rules, setRules] = useState<{ index: string; name: string }[]>([]);
  const [selectedRule, setSelectedRule] = useState<{
    name: string;
    desc: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setLoading(true);
      getRules(category)
        .then((data) => {
          console.log(`📌 Getting ${category} data:`, data);
          setRules(data.results || []);
        })
        .finally(() => setLoading(false));
    }
  }, [category]);

  const handleRuleClick = (ruleIndex: string) => {
    if (category) {
      setLoading(true);
      getRuleDetail(category, ruleIndex)
        .then((data) => {
          console.log(`📌 Rule detail (${ruleIndex}):`, data);

          // Process the description based on its data structure
          let description = "";
          if (data.desc) {
            description = Array.isArray(data.desc)
              ? data.desc.join("\n\n")
              : typeof data.desc === "string"
              ? data.desc
              : JSON.stringify(data.desc);
          } else if (data.description) {
            description = Array.isArray(data.description)
              ? data.description.join("\n\n")
              : data.description;
          } else {
            // Create a description from other available fields if desc is not present
            description = Object.entries(data)
              .filter(([key]) => !["index", "name", "url"].includes(key))
              .map(([key, value]) => {
                if (typeof value === "object" && value !== null) {
                  return `## ${
                    key.charAt(0).toUpperCase() + key.slice(1)
                  }\n${JSON.stringify(value, null, 2)}`;
                }
                return `## ${
                  key.charAt(0).toUpperCase() + key.slice(1)
                }\n${value}`;
              })
              .join("\n\n");
          }

          setSelectedRule({
            name: data.name,
            desc: description,
          });
        })
        .catch((error) => {
          console.error("Error fetching rule details:", error);
          setSelectedRule({
            name: "Error Loading Rule",
            desc: "Failed to load the rule details. Please try again later.",
          });
        })
        .finally(() => setLoading(false));
    }
  };

  return (
    <div className="flex h-screen bg-base-200">
      {/* Sidebar */}
      <SideBarRules
        categories={categories}
        selectedCategory={category}
        setCategory={setCategory}
        rules={rules}
        onRuleClick={handleRuleClick}
      />

      {/* Rule details */}
      <div className="flex-1 p-6 overflow-auto">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : selectedRule ? (
          <RulesDetailPage rule={selectedRule} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-xl">Please select a rule to view details</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RulesPage;
