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
import { Equipment } from '../types';

const EquipmentPage: React.FC = () => {
  const { equipment, addEquipment, updateEquipment, deleteEquipment, projects } = useAppStore();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [formData, setFormData] = useState<Partial<Equipment>>({
    name: '',
    type: 'tools',
    category: '',
    status: 'available',
    assignedProject: '',
    assignedTo: '',
    purchaseDate: new Date(),
    warrantyExpiry: new Date(),
    lastInspection: new Date(),
    nextInspection: new Date(),
    condition: 'good',
  });

  const handleOpenDialog = (equipment?: Equipment) => {
    if (equipment) {
      setEditingEquipment(equipment);
      setFormData(equipment);
    } else {
      setEditingEquipment(null);
      setFormData({
        name: '',
        type: 'tools',
        category: '',
        status: 'available',
        assignedProject: '',
        assignedTo: '',
        purchaseDate: new Date(),
        warrantyExpiry: new Date(),
        lastInspection: new Date(),
        nextInspection: new Date(),
        condition: 'good',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingEquipment(null);
  };

  const handleSubmit = () => {
    if (editingEquipment) {
      updateEquipment(editingEquipment.id, formData);
    } else {
      const newEquipment: Equipment = {
        ...formData as Equipment,
        id: Date.now().toString(),
      };
      addEquipment(newEquipment);
    }
    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this equipment?')) {
      deleteEquipment(id);
    }
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Equipment Name', width: 200, flex: 1 },
    { field: 'type', headerName: 'Type', width: 120 },
    { field: 'category', headerName: 'Category', width: 120 },
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
    {
      field: 'condition',
      headerName: 'Condition',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color={
            params.value === 'excellent' ? 'success' :
            params.value === 'good' ? 'primary' :
            params.value === 'fair' ? 'warning' : 'error'
          }
        />
      ),
    },
    {
      field: 'assignedProject',
      headerName: 'Assigned Project',
      width: 150,
      valueGetter: (params) => {
        const project = projects.find(p => p.id === params.value);
        return project?.name || 'Not Assigned';
      },
    },
    { field: 'assignedTo', headerName: 'Assigned To', width: 120 },
    {
      field: 'purchaseDate',
      headerName: 'Purchase Date',
      width: 120,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString(),
    },
    {
      field: 'warrantyExpiry',
      headerName: 'Warranty Expiry',
      width: 130,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString(),
    },
    {
      field: 'nextInspection',
      headerName: 'Next Inspection',
      width: 130,
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
        <Typography variant="h4">Equipment Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Equipment
        </Button>
      </Box>

      <Card>
        <CardContent>
          <DataGrid
            rows={equipment}
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
          {editingEquipment ? 'Edit Equipment' : 'Add New Equipment'}
        </DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Equipment Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Equipment Type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as Equipment['type'] })}
                >
                  <MenuItem value="tools">Tools</MenuItem>
                  <MenuItem value="machinery">Machinery</MenuItem>
                  <MenuItem value="safety">Safety Equipment</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Equipment['status'] })}
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
                  select
                  label="Condition"
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value as Equipment['condition'] })}
                >
                  <MenuItem value="excellent">Excellent</MenuItem>
                  <MenuItem value="good">Good</MenuItem>
                  <MenuItem value="fair">Fair</MenuItem>
                  <MenuItem value="poor">Poor</MenuItem>
                </TextField>
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
                <TextField
                  fullWidth
                  label="Assigned To"
                  value={formData.assignedTo || ''}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value || undefined })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Purchase Date"
                  value={formData.purchaseDate}
                  onChange={(date) => setFormData({ ...formData, purchaseDate: date || new Date() })}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Warranty Expiry"
                  value={formData.warrantyExpiry}
                  onChange={(date) => setFormData({ ...formData, warrantyExpiry: date || new Date() })}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Last Inspection"
                  value={formData.lastInspection}
                  onChange={(date) => setFormData({ ...formData, lastInspection: date || new Date() })}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Next Inspection"
                  value={formData.nextInspection}
                  onChange={(date) => setFormData({ ...formData, nextInspection: date || new Date() })}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
            </Grid>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingEquipment ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EquipmentPage;
