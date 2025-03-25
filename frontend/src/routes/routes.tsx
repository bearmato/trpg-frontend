import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import RulesPage from "../pages/RulesPage";
import CharacterCreationPage from "../pages/CharacterCreationPage";
import CharacterLibraryPage from "../pages/CharacterLibraryPage";
import CharacterDetailPage from "../pages/CharacterDetailPage";
import AIGMPage from "../pages/AIGMPage";
import Layout from "../layouts/Layout";
import DicePage from "../pages/DicePage";
import MapGeneratorPage from "../pages/MapGeneratorPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProfilePage from "../pages/ProfilePage";

import ProtectedRoute from "../components/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/rules", element: <RulesPage /> },
      { path: "/character-creation", element: <CharacterCreationPage /> },
      {
        path: "/character-library",
        element: (
          <ProtectedRoute>
            <CharacterLibraryPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/character-library/:id",
        element: (
          <ProtectedRoute>
            <CharacterDetailPage />
          </ProtectedRoute>
        ),
      },
      { path: "/ai-gm", element: <AIGMPage /> },
      { path: "/dice", element: <DicePage /> },
      { path: "/map-generator", element: <MapGeneratorPage /> },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
]);
export default router;
