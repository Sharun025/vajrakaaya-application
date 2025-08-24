import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  Chip,
  LinearProgress,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useAppStore } from '../store';
import { CostCenter } from '../types';

const CostCenters: React.FC = () => {
  const { costCenters, addCostCenter, updateCostCenter, deleteCostCenter, projects } = useAppStore();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCostCenter, setEditingCostCenter] = useState<CostCenter | null>(null);
  const [formData, setFormData] = useState<Partial<CostCenter>>({
    name: '',
    description: '',
    budget: 0,
    spent: 0,
    projectId: '',
    manager: '',
  });

  const handleOpenDialog = (costCenter?: CostCenter) => {
    if (costCenter) {
      setEditingCostCenter(costCenter);
      setFormData(costCenter);
    } else {
      setEditingCostCenter(null);
      setFormData({
        name: '',
        description: '',
        budget: 0,
        spent: 0,
        projectId: '',
        manager: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCostCenter(null);
  };

  const handleSubmit = () => {
    if (editingCostCenter) {
      updateCostCenter(editingCostCenter.id, formData);
    } else {
      const newCostCenter: CostCenter = {
        ...formData as CostCenter,
        id: Date.now().toString(),
      };
      addCostCenter(newCostCenter);
    }
    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this cost center?')) {
      deleteCostCenter(id);
    }
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Cost Center Name', width: 200, flex: 1 },
    { field: 'description', headerName: 'Description', width: 250 },
    {
      field: 'projectId',
      headerName: 'Project',
      width: 200,
      valueGetter: (params) => {
        const project = projects.find(p => p.id === params.value);
        return project?.name || 'Not Assigned';
      },
    },
    { field: 'manager', headerName: 'Manager', width: 150 },
    {
      field: 'budget',
      headerName: 'Budget',
      width: 120,
      valueFormatter: (params) => `$${params.value.toLocaleString()}`,
    },
    {
      field: 'spent',
      headerName: 'Spent',
      width: 120,
      valueFormatter: (params) => `$${params.value.toLocaleString()}`,
    },
    {
      field: 'remaining',
      headerName: 'Remaining',
      width: 120,
      valueGetter: (params) => params.row.budget - params.row.spent,
      valueFormatter: (params) => `$${params.value.toLocaleString()}`,
    },
    {
      field: 'utilization',
      headerName: 'Utilization',
      width: 150,
      renderCell: (params) => {
        const percentage = (params.row.spent / params.row.budget) * 100;
        const color = percentage > 90 ? 'error' : percentage > 75 ? 'warning' : 'success';
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <Box sx={{ flexGrow: 1, mr: 1 }}>
              <LinearProgress
                variant="determinate"
                value={Math.min(percentage, 100)}
                color={color}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
            <Typography variant="body2">{percentage.toFixed(1)}%</Typography>
          </Box>
        );
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params: any) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            size="small"
            onClick={() => handleOpenDialog(params.row)}
            color="primary"
          >
            <ViewIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleOpenDialog(params.row)}
            color="primary"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleDelete(params.id as string)}
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  const totalBudget = costCenters.reduce((sum, cc) => sum + cc.budget, 0);
  const totalSpent = costCenters.reduce((sum, cc) => sum + cc.spent, 0);
  const totalRemaining = totalBudget - totalSpent;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Cost Center Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Cost Center
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Budget
              </Typography>
              <Typography variant="h4">
                ${totalBudget.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Spent
              </Typography>
              <Typography variant="h4">
                ${totalSpent.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Remaining
              </Typography>
              <Typography variant="h4">
                ${totalRemaining.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Utilization
              </Typography>
              <Typography variant="h4">
                {totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(1) : 0}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <DataGrid
            rows={costCenters}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            disableSelectionOnClick
            autoHeight
            sx={{
              '& .MuiDataGrid-cell': {
                borderBottom: '1px solid #333',
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#2a2a2a',
                borderBottom: '2px solid #333',
              },
            }}
          />
        </CardContent>
      </Card>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingCostCenter ? 'Edit Cost Center' : 'Add New Cost Center'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Cost Center Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Project"
                value={formData.projectId || ''}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
              >
                <MenuItem value="">Not Assigned</MenuItem>
                {projects.map((project) => (
                  <MenuItem key={project.id} value={project.id}>
                    {project.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Manager"
                value={formData.manager}
                onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Budget"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Spent"
                value={formData.spent}
                onChange={(e) => setFormData({ ...formData, spent: Number(e.target.value) })}
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingCostCenter ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CostCenters;
