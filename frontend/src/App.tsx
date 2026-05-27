import React, { useState } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from './shared/layouts/MainLayout';
import { Dashboard } from './page/Dashboard';
import EmployeeFormPage from './page/EmployeeFormPage';
import { ApiMode } from './core/api/client';
import { API_MODE_KEY } from './core/config/constants';

import { ErrorBoundary } from './shared/components/ErrorBoundary';
import { NotFoundPage } from './page/NotFoundPage';

export const App: React.FC = () => {
  const [apiMode, setApiMode] = useState<ApiMode>(() => {
    const saved = localStorage.getItem(API_MODE_KEY);
    return saved === 'express' || saved === 'json-server' ? saved : 'express';
  });

  const handleApiModeChange = (mode: ApiMode) => {
    setApiMode(mode);
    localStorage.setItem(API_MODE_KEY, mode);
  };

  return (
    <ChakraProvider>
      <ErrorBoundary>
        <Routes>
          <Route
            path="/"
            element={
              <MainLayout apiMode={apiMode} onApiModeChange={handleApiModeChange}>
                <Dashboard apiMode={apiMode} onApiModeChange={handleApiModeChange} />
              </MainLayout>
            }
          />

          <Route
            path="/employees/new"
            element={
              <MainLayout apiMode={apiMode} onApiModeChange={handleApiModeChange}>
                <EmployeeFormPage apiMode={apiMode} mode="add" />
              </MainLayout>
            }
          />

          <Route
            path="/employees/:id/edit"
            element={
              <MainLayout apiMode={apiMode} onApiModeChange={handleApiModeChange}>
                <EmployeeFormPage apiMode={apiMode} mode="edit" />
              </MainLayout>
            }
          />

          {/* Catch-all 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </ErrorBoundary>
    </ChakraProvider>
  );
};

export default App;
