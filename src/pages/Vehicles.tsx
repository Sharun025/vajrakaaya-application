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
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useAppStore } from '../store';
import { Vehicle } from '../types';

const Vehicles: React.FC = () => {
  const { vehicles, addVehicle, updateVehicle, deleteVehicle, projects } = useAppStore();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState<Partial<Vehicle>>({
    name: '',
    type: 'truck',
    model: '',
    year: new Date().getFullYear(),
    licensePlate: '',
    status: 'available',
    currentLocation: '',
    assignedProject: '',
    lastMaintenance: new Date(),
    nextMaintenance: new Date(),
    fuelLevel: 100,
    mileage: 0,
  });

  const handleOpenDialog = (vehicle?: Vehicle) => {
    if (vehicle) {
      setEditingVehicle(vehicle);
      setFormData(vehicle);
    } else {
      setEditingVehicle(null);
      setFormData({
        name: '',
        type: 'truck',
        model: '',
        year: new Date().getFullYear(),
        licensePlate: '',
        status: 'available',
        currentLocation: '',
        assignedProject: '',
        lastMaintenance: new Date(),
        nextMaintenance: new Date(),
        fuelLevel: 100,
        mileage: 0,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingVehicle(null);
  };

  const handleSubmit = () => {
    if (editingVehicle) {
      updateVehicle(editingVehicle.id, formData);
    } else {
      const newVehicle: Vehicle = {
        ...formData as Vehicle,
        id: Date.now().toString(),
      };
      addVehicle(newVehicle);
    }
    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      deleteVehicle(id);
    }
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Vehicle Name', width: 150, flex: 1 },
    { field: 'type', headerName: 'Type', width: 120 },
    { field: 'model', headerName: 'Model', width: 120 },
    { field: 'licensePlate', headerName: 'License Plate', width: 130 },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color={
            params.value === 'available' ? 'success' :
            params.value === 'in-use' ? 'primary' :
            params.value === 'maintenance' ? 'warning' : 'error'
          }
        />
      ),
    },
    { field: 'currentLocation', headerName: 'Location', width: 150 },
    {
      field: 'assignedProject',
      headerName: 'Assigned Project',
      width: 150,
      valueGetter: (params) => {
        const project = projects.find(p => p.id === params.value);
        return project?.name || 'Not Assigned';
      },
    },
    {
      field: 'fuelLevel',
      headerName: 'Fuel Level',
      width: 100,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <Box sx={{ flexGrow: 1, mr: 1 }}>
            <Box
              sx={{
                width: '100%',
                height: 8,
                backgroundColor: 'grey.300',
                borderRadius: 4,
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  width: `${params.value}%`,
                  height: '100%',
                  backgroundColor: params.value < 20 ? 'error.main' : 'success.main',
                }}
              />
            </Box>
          </Box>
          <Typography variant="body2">{params.value}%</Typography>
        </Box>
      ),
    },
    {
      field: 'mileage',
      headerName: 'Mileage',
      width: 100,
      valueFormatter: (params) => `${params.value.toLocaleString()} km`,
    },
    {
      field: 'nextMaintenance',
      headerName: 'Next Maintenance',
      width: 140,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString(),
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

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Vehicle Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Vehicle
        </Button>
      </Box>

      <Card>
        <CardContent>
          <DataGrid
            rows={vehicles}
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
          {editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
        </DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Vehicle Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Vehicle Type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as Vehicle['type'] })}
                >
                  <MenuItem value="truck">Truck</MenuItem>
                  <MenuItem value="excavator">Excavator</MenuItem>
                  <MenuItem value="crane">Crane</MenuItem>
                  <MenuItem value="bulldozer">Bulldozer</MenuItem>
                  <MenuItem value="loader">Loader</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Model"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="License Plate"
                  value={formData.licensePlate}
                  onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Year"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Vehicle['status'] })}
                >
                  <MenuItem value="available">Available</MenuItem>
                  <MenuItem value="in-use">In Use</MenuItem>
                  <MenuItem value="maintenance">Maintenance</MenuItem>
                  <MenuItem value="retired">Retired</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Current Location"
                  value={formData.currentLocation}
                  onChange={(e) => setFormData({ ...formData, currentLocation: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Assigned Project"
                  value={formData.assignedProject || ''}
                  onChange={(e) => setFormData({ ...formData, assignedProject: e.target.value || undefined })}
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
                <DatePicker
                  label="Last Maintenance"
                  value={formData.lastMaintenance}
                  onChange={(date) => setFormData({ ...formData, lastMaintenance: date || new Date() })}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Next Maintenance"
                  value={formData.nextMaintenance}
                  onChange={(date) => setFormData({ ...formData, nextMaintenance: date || new Date() })}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Fuel Level (%)"
                  value={formData.fuelLevel}
                  onChange={(e) => setFormData({ ...formData, fuelLevel: Number(e.target.value) })}
                  inputProps={{ min: 0, max: 100 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Mileage (km)"
                  value={formData.mileage}
                  onChange={(e) => setFormData({ ...formData, mileage: Number(e.target.value) })}
                  inputProps={{ min: 0 }}
                />
              </Grid>
            </Grid>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingVehicle ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Vehicles;
