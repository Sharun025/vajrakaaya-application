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
  Alert,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useAppStore } from '../store';
import { Material } from '../types';

const Materials: React.FC = () => {
  const { materials, addMaterial, updateMaterial, deleteMaterial } = useAppStore();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [formData, setFormData] = useState<Partial<Material>>({
    name: '',
    category: '',
    unit: '',
    currentStock: 0,
    minimumStock: 0,
    maximumStock: 0,
    unitPrice: 0,
    supplier: '',
    location: '',
    lastUpdated: new Date(),
    expiryDate: undefined,
    status: 'available',
  });

  const handleOpenDialog = (material?: Material) => {
    if (material) {
      setEditingMaterial(material);
      setFormData(material);
    } else {
      setEditingMaterial(null);
      setFormData({
        name: '',
        category: '',
        unit: '',
        currentStock: 0,
        minimumStock: 0,
        maximumStock: 0,
        unitPrice: 0,
        supplier: '',
        location: '',
        lastUpdated: new Date(),
        expiryDate: undefined,
        status: 'available',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingMaterial(null);
  };

  const handleSubmit = () => {
    if (editingMaterial) {
      updateMaterial(editingMaterial.id, formData);
    } else {
      const newMaterial: Material = {
        ...formData as Material,
        id: Date.now().toString(),
      };
      addMaterial(newMaterial);
    }
    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      deleteMaterial(id);
    }
  };

  const getStockStatus = (material: Material) => {
    if (material.currentStock <= material.minimumStock) {
      return { status: 'low-stock', color: 'warning' as const };
    } else if (material.currentStock === 0) {
      return { status: 'out-of-stock', color: 'error' as const };
    } else {
      return { status: 'available', color: 'success' as const };
    }
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Material Name', width: 300, flex: 1 },
    { field: 'category', headerName: 'Category', width: 180 },
    { field: 'unit', headerName: 'Unit', width: 120 },
    {
      field: 'currentStock',
      headerName: 'Current Stock',
      width: 150,
      renderCell: (params) => {
        const material = params.row;
        const stockStatus = getStockStatus(material);
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ mr: 1 }}>
              {params.value}
            </Typography>
            {stockStatus.status !== 'available' && (
              <WarningIcon sx={{ color: 'warning.main', fontSize: 16 }} />
            )}
          </Box>
        );
      },
    },
    { field: 'minimumStock', headerName: 'Min Stock', width: 130 },
    { field: 'maximumStock', headerName: 'Max Stock', width: 130 },
    {
      field: 'unitPrice',
      headerName: 'Unit Price',
      width: 150,
      valueFormatter: (params) => `$${params.value.toFixed(2)}`,
    },
    {
      field: 'totalValue',
      headerName: 'Total Value',
      width: 150,
      valueGetter: (params) => params.row.currentStock * params.row.unitPrice,
      valueFormatter: (params) => `$${params.value.toFixed(2)}`,
    },
    { field: 'supplier', headerName: 'Supplier', width: 200 },
    { field: 'location', headerName: 'Location', width: 150 },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      renderCell: (params) => {
        const stockStatus = getStockStatus(params.row);
        return (
          <Chip
            label={stockStatus.status}
            size="small"
            color={stockStatus.color}
          />
        );
      },
    },
    {
      field: 'lastUpdated',
      headerName: 'Last Updated',
      width: 150,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString(),
    },
    {
      field: 'expiryDate',
      headerName: 'Expiry Date',
      width: 150,
      valueFormatter: (params) => params.value ? new Date(params.value).toLocaleDateString() : 'N/A',
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 180,
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

  const lowStockMaterials = materials.filter(m => m.currentStock <= m.minimumStock);
  const outOfStockMaterials = materials.filter(m => m.currentStock === 0);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Materials & Inventory Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Material
        </Button>
      </Box>

      {/* Alerts */}
      {(lowStockMaterials.length > 0 || outOfStockMaterials.length > 0) && (
        <Box sx={{ mb: 3 }}>
          {outOfStockMaterials.length > 0 && (
            <Alert severity="error" sx={{ mb: 1 }}>
              {outOfStockMaterials.length} material(s) are out of stock
            </Alert>
          )}
          {lowStockMaterials.length > 0 && (
            <Alert severity="warning">
              {lowStockMaterials.length} material(s) are low on stock
            </Alert>
          )}
        </Box>
      )}

      <Card>
        <CardContent>
          <DataGrid
            rows={materials}
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
          {editingMaterial ? 'Edit Material' : 'Add New Material'}
        </DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Material Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
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
                  label="Unit"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  placeholder="e.g., kg, pcs, liters"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Current Stock"
                  value={formData.currentStock}
                  onChange={(e) => setFormData({ ...formData, currentStock: Number(e.target.value) })}
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Minimum Stock"
                  value={formData.minimumStock}
                  onChange={(e) => setFormData({ ...formData, minimumStock: Number(e.target.value) })}
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Maximum Stock"
                  value={formData.maximumStock}
                  onChange={(e) => setFormData({ ...formData, maximumStock: Number(e.target.value) })}
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Unit Price"
                  value={formData.unitPrice}
                  onChange={(e) => setFormData({ ...formData, unitPrice: Number(e.target.value) })}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Supplier"
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Expiry Date (Optional)"
                  value={formData.expiryDate}
                  onChange={(date) => setFormData({ ...formData, expiryDate: date || undefined })}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
            </Grid>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingMaterial ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Materials;
