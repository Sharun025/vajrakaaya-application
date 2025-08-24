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
import { InventoryTransaction } from '../types';

const Inventory: React.FC = () => {
  const { 
    inventoryTransactions, 
    addInventoryTransaction, 
    materials, 
    projects 
  } = useAppStore();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<InventoryTransaction | null>(null);
  const [formData, setFormData] = useState<Partial<InventoryTransaction>>({
    materialId: '',
    type: 'in',
    quantity: 0,
    date: new Date(),
    projectId: '',
    reason: '',
    performedBy: '',
    notes: '',
  });

  const handleOpenDialog = (transaction?: InventoryTransaction) => {
    if (transaction) {
      setEditingTransaction(transaction);
      setFormData(transaction);
    } else {
      setEditingTransaction(null);
      setFormData({
        materialId: '',
        type: 'in',
        quantity: 0,
        date: new Date(),
        projectId: '',
        reason: '',
        performedBy: '',
        notes: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTransaction(null);
  };

  const handleSubmit = () => {
    if (editingTransaction) {
      // Update transaction logic would go here
      console.log('Update transaction:', formData);
    } else {
      const newTransaction: InventoryTransaction = {
        ...formData as InventoryTransaction,
        id: Date.now().toString(),
      };
      addInventoryTransaction(newTransaction);
    }
    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      // Delete transaction logic would go here
      console.log('Delete transaction:', id);
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'materialId',
      headerName: 'Material',
      width: 200,
      valueGetter: (params) => {
        const material = materials.find(m => m.id === params.value);
        return material?.name || 'Unknown Material';
      },
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value === 'in' ? 'IN' : params.value === 'out' ? 'OUT' : 'ADJUST'}
          size="small"
          color={
            params.value === 'in' ? 'success' :
            params.value === 'out' ? 'error' : 'warning'
          }
        />
      ),
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      width: 100,
      valueGetter: (params) => {
        const material = materials.find(m => m.id === params.row.materialId);
        return `${params.value} ${material?.unit || ''}`;
      },
    },
    {
      field: 'projectId',
      headerName: 'Project',
      width: 150,
      valueGetter: (params) => {
        const project = projects.find(p => p.id === params.value);
        return project?.name || 'Not Assigned';
      },
    },
    { field: 'reason', headerName: 'Reason', width: 150 },
    { field: 'performedBy', headerName: 'Performed By', width: 120 },
    {
      field: 'date',
      headerName: 'Date',
      width: 120,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString(),
    },
    { field: 'notes', headerName: 'Notes', width: 200 },
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
        <Typography variant="h4">Inventory Transactions</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Transaction
        </Button>
      </Box>

      <Card>
        <CardContent>
          <DataGrid
            rows={inventoryTransactions}
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
          {editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
        </DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Material"
                  value={formData.materialId || ''}
                  onChange={(e) => setFormData({ ...formData, materialId: e.target.value })}
                >
                  {materials.map((material) => (
                    <MenuItem key={material.id} value={material.id}>
                      {material.name} ({material.unit})
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Transaction Type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as InventoryTransaction['type'] })}
                >
                  <MenuItem value="in">Stock In</MenuItem>
                  <MenuItem value="out">Stock Out</MenuItem>
                  <MenuItem value="adjustment">Adjustment</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Quantity"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Project"
                  value={formData.projectId || ''}
                  onChange={(e) => setFormData({ ...formData, projectId: e.target.value || undefined })}
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
                  label="Date"
                  value={formData.date}
                  onChange={(date) => setFormData({ ...formData, date: date || new Date() })}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Performed By"
                  value={formData.performedBy}
                  onChange={(e) => setFormData({ ...formData, performedBy: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Reason"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Notes"
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </Grid>
            </Grid>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingTransaction ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Inventory;
