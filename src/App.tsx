import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { ExplorePage } from './pages/ExplorePage';
import { DashboardPage } from './pages/DashboardPage';
import { MyPromptsPage } from './pages/MyPromptsPage';
import { CreatePromptPage } from './pages/CreatePromptPage';
import { EditPromptPage } from './pages/EditPromptPage';
import { PromptDetailPage } from './pages/PromptDetailPage';
import { CollectionsPage } from './pages/CollectionsPage';
import { CollectionDetailPage } from './pages/CollectionDetailPage';
import { ProfilePage } from './pages/ProfilePage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';

export function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <div className="min-h-screen flex flex-col bg-stone-100 text-stone-900 font-sans antialiased selection:bg-amber-500 selection:text-stone-950">
            <Navbar />

            <div className="flex-1">
              <Routes>
                {/* Public Discovery Page */}
                <Route path="/" element={<ExplorePage />} />

                {/* Prompt Details (Public View) */}
                <Route path="/prompts/:id" element={<PromptDetailPage />} />

                {/* Authentication Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />

                {/* Protected Authenticated Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-prompts"
                  element={
                    <ProtectedRoute>
                      <MyPromptsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/create"
                  element={
                    <ProtectedRoute>
                      <CreatePromptPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/edit-prompt/:id"
                  element={
                    <ProtectedRoute>
                      <EditPromptPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/collections"
                  element={
                    <ProtectedRoute>
                      <CollectionsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/collections/:id"
                  element={
                    <ProtectedRoute>
                      <CollectionDetailPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>

            {/* Clean, Non-intrusive Minimal Footer */}
            <footer className="border-t border-stone-200 bg-white py-6 text-center text-xs text-stone-500">
              <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="font-medium text-stone-600">
                  Prompt Library &copy; {new Date().getFullYear()} &mdash; Community Prompt Organizer
                </p>
                <div className="flex items-center gap-4 text-xs text-stone-400">
                  <span>AI Validated Prompts</span>
                  <span>•</span>
                  <span>JWT Authenticated</span>
                  <span>•</span>
                  <span>Community Peer Ratings</span>
                </div>
              </div>
            </footer>
          </div>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
