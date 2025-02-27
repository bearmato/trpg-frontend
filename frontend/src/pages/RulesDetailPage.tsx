import ReactMarkdown from "react-markdown";

interface RulesDetailPageProps {
  rule: { name: string; desc: string };
}

const RulesDetailPage = ({ rule }: RulesDetailPageProps) => {
  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold">{rule.name}</h2>
      <div className="mt-4 prose max-w-none">
        <ReactMarkdown>{rule.desc}</ReactMarkdown>
      </div>
    </div>
  );
};

export default RulesDetailPage;
