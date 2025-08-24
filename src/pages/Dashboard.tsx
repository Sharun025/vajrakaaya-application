import React, { useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
} from '@mui/material';
import {
  Business,
  DirectionsCar,
  Inventory,
  AttachMoney,
  TrendingUp,
  TrendingDown,
  Warning,
  CheckCircle,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { useAppStore } from '../store';
import { Project, Vehicle, Material, Expense } from '../types';

const Dashboard: React.FC = () => {
  const { 
    projects, 
    vehicles, 
    materials, 
    expenses, 
    getDashboardStats,
    getProjectsByStatus,
    getVehiclesByStatus,
    getMaterialsByStatus 
  } = useAppStore();

  const stats = getDashboardStats();
  const activeProjects = getProjectsByStatus('active');
  const availableVehicles = getVehiclesByStatus('available');
  const lowStockMaterials = getMaterialsByStatus('low-stock');

  // Mock data for charts
  const projectStatusData = [
    { name: 'Active', value: activeProjects.length, color: '#4caf50' },
    { name: 'Planning', value: getProjectsByStatus('planning').length, color: '#2196f3' },
    { name: 'Completed', value: getProjectsByStatus('completed').length, color: '#ff9800' },
    { name: 'On Hold', value: getProjectsByStatus('on-hold').length, color: '#f44336' },
  ];

  const monthlyExpensesData = [
    { name: 'Jan', expenses: 45000 },
    { name: 'Feb', expenses: 52000 },
    { name: 'Mar', expenses: 48000 },
    { name: 'Apr', expenses: 61000 },
    { name: 'May', expenses: 55000 },
    { name: 'Jun', expenses: 67000 },
  ];

  const vehicleStatusData = [
    { name: 'Available', value: availableVehicles.length, color: '#4caf50' },
    { name: 'In Use', value: getVehiclesByStatus('in-use').length, color: '#2196f3' },
    { name: 'Maintenance', value: getVehiclesByStatus('maintenance').length, color: '#ff9800' },
    { name: 'Retired', value: getVehiclesByStatus('retired').length, color: '#f44336' },
  ];

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    trend?: { value: number; isPositive: boolean };
  }> = ({ title, value, icon, color, trend }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="textSecondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
              {value}
            </Typography>
            {trend && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                {trend.isPositive ? (
                  <TrendingUp sx={{ color: 'success.main', fontSize: 16, mr: 0.5 }} />
                ) : (
                  <TrendingDown sx={{ color: 'error.main', fontSize: 16, mr: 0.5 }} />
                )}
                <Typography
                  variant="body2"
                  color={trend.isPositive ? 'success.main' : 'error.main'}
                >
                  {trend.value}%
                </Typography>
              </Box>
            )}
          </Box>
          <Box
            sx={{
              backgroundColor: color,
              borderRadius: '50%',
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const RecentProjects: React.FC = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Recent Projects
        </Typography>
        {projects.slice(0, 5).map((project) => (
          <Box key={project.id} sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                {project.name}
              </Typography>
              <Chip
                label={project.status}
                size="small"
                color={
                  project.status === 'active' ? 'success' :
                  project.status === 'planning' ? 'primary' :
                  project.status === 'completed' ? 'warning' : 'error'
                }
              />
            </Box>
            <Typography variant="body2" color="textSecondary">
              {project.location} • {project.client}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <Box sx={{ flexGrow: 1, mr: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={project.progress}
                  sx={{ height: 6, borderRadius: 3 }}
                />
              </Box>
              <Typography variant="body2" color="textSecondary">
                {project.progress}%
              </Typography>
            </Box>
          </Box>
        ))}
      </CardContent>
    </Card>
  );

  const Alerts: React.FC = () => {
    const alerts = [
      { type: 'warning', message: `${lowStockMaterials.length} materials are low on stock` },
      { type: 'info', message: `${getVehiclesByStatus('maintenance').length} vehicles need maintenance` },
      { type: 'error', message: '3 projects are behind schedule' },
    ];

    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Alerts & Notifications
          </Typography>
          {alerts.map((alert, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              {alert.type === 'warning' && <Warning sx={{ color: 'warning.main', mr: 1 }} />}
              {alert.type === 'info' && <TrendingUp sx={{ color: 'info.main', mr: 1 }} />}
              {alert.type === 'error' && <TrendingDown sx={{ color: 'error.main', mr: 1 }} />}
              <Typography variant="body2" color="textSecondary">
                {alert.message}
              </Typography>
            </Box>
          ))}
        </CardContent>
      </Card>
    );
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Dashboard Overview
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Projects"
            value={stats.totalProjects}
            icon={<Business sx={{ color: 'white' }} />}
            color="#2196f3"
            trend={{ value: 12, isPositive: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Projects"
            value={stats.activeProjects}
            icon={<CheckCircle sx={{ color: 'white' }} />}
            color="#4caf50"
            trend={{ value: 8, isPositive: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Vehicles"
            value={stats.totalVehicles}
            icon={<DirectionsCar sx={{ color: 'white' }} />}
            color="#ff9800"
            trend={{ value: 5, isPositive: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Monthly Expenses"
            value={`$${stats.monthlyExpenses.toLocaleString()}`}
            icon={<AttachMoney sx={{ color: 'white' }} />}
            color="#f44336"
            trend={{ value: 15, isPositive: false }}
          />
        </Grid>
      </Grid>

      {/* Charts and Details */}
      <Grid container spacing={3}>
        {/* Project Status Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Project Status Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={projectStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {projectStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Monthly Expenses Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Monthly Expenses Trend
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyExpensesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke="#2196f3"
                    strokeWidth={2}
                    dot={{ fill: '#2196f3', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Vehicle Status Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Vehicle Status Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={vehicleStatusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Projects */}
        <Grid item xs={12} md={6}>
          <RecentProjects />
        </Grid>

        {/* Alerts */}
        <Grid item xs={12} md={6}>
          <Alerts />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
