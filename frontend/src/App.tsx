import React, { useState } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { MainLayout } from './shared/layouts/MainLayout';
import { Dashboard } from './page/Dashboard';
import { ApiMode } from './core/api/client';
import { API_MODE_KEY } from './core/config/constants';

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
      <MainLayout apiMode={apiMode} onApiModeChange={handleApiModeChange}>
        <Dashboard apiMode={apiMode} onApiModeChange={handleApiModeChange} />
      </MainLayout>
    </ChakraProvider>
  );
};

export default App;
