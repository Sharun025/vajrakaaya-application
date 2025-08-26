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
    { field: 'materialName', headerName: 'Material Name', width: 300, flex: 1 },
    { field: 'category', headerName: 'Category', width: 200 },
    { field: 'quantity', headerName: 'Quantity', width: 150, type: 'number' },
    { field: 'unit', headerName: 'Unit', width: 120 },
    { field: 'location', headerName: 'Location', width: 200 },
    { field: 'lastUpdated', headerName: 'Last Updated', width: 180 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Box>
          <IconButton onClick={() => handleOpenDialog(params.row)} size="small">
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)} size="small">
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
            checkboxSelection
            disableSelectionOnClick
            autoHeight
            sx={{
              '& .MuiDataGrid-root': {
                border: 'none',
              },
              '& .MuiDataGrid-cell': {
                borderBottom: '1px solid #333',
                padding: '16px',
                fontSize: '14px',
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#2a2a2a',
                borderBottom: '2px solid #333',
                padding: '16px',
                fontSize: '16px',
                fontWeight: 'bold',
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: '#3a3a3a',
              },
              '& .MuiDataGrid-virtualScroller': {
                backgroundColor: '#1a1a1a',
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
