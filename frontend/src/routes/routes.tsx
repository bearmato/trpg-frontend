import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import RulesPage from "../pages/RulesPage";
import RuleDetailPage from "../pages/RulesDetailPage";
import CharacterCreationPage from "../pages/CharacterCreationPage";
import AIGMPage from "../pages/AIGMPage";
import Layout from "../layouts/Layout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, //  让所有页面使用 `Layout`
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/rules", element: <RulesPage /> },
      { path: "rules/:category/:ruleName", element: <RuleDetailPage /> },
      { path: "/character-creation", element: <CharacterCreationPage /> },
      { path: "/ai-gm", element: <AIGMPage /> },
    ],
  },
]);

export default router;
