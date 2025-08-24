import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { theme } from './theme';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Sites from './pages/Sites';
import Vehicles from './pages/Vehicles';
import Equipment from './pages/Equipment';
import Materials from './pages/Materials';
import Inventory from './pages/Inventory';
import Expenses from './pages/Expenses';
import CostCenters from './pages/CostCenters';
import Users from './pages/Users';
import { useAppStore } from './store';

function App() {
  const { currentUser } = useAppStore();

  // Mock user for demo purposes
  React.useEffect(() => {
    if (!currentUser) {
      useAppStore.getState().setCurrentUser({
        id: '1',
        name: 'Admin User',
        email: 'admin@vajrakaaya.com',
        role: 'admin',
        department: 'Management',
        phone: '+1234567890',
      });
    }
  }, [currentUser]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/sites" element={<Sites />} />
              <Route path="/vehicles" element={<Vehicles />} />
              <Route path="/equipment" element={<Equipment />} />
              <Route path="/materials" element={<Materials />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/cost-centers" element={<CostCenters />} />
              <Route path="/users" element={<Users />} />
            </Routes>
          </Layout>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
