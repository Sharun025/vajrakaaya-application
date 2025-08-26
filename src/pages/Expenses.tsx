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
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useAppStore } from '../store';
import { Expense } from '../types';

const Expenses: React.FC = () => {
  const { expenses, addExpense, updateExpense, deleteExpense, projects } = useAppStore();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [formData, setFormData] = useState<Partial<Expense>>({
    title: '',
    description: '',
    amount: 0,
    category: 'other',
    projectId: '',
    date: new Date(),
    status: 'pending',
    vendor: '',
    paymentMethod: 'cash',
  });

  const handleOpenDialog = (expense?: Expense) => {
    if (expense) {
      setEditingExpense(expense);
      setFormData(expense);
    } else {
      setEditingExpense(null);
      setFormData({
        title: '',
        description: '',
        amount: 0,
        category: 'other',
        projectId: '',
        date: new Date(),
        status: 'pending',
        vendor: '',
        paymentMethod: 'cash',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingExpense(null);
  };

  const handleSubmit = () => {
    if (editingExpense) {
      updateExpense(editingExpense.id, formData);
    } else {
      const newExpense: Expense = {
        ...formData as Expense,
        id: Date.now().toString(),
      };
      addExpense(newExpense);
    }
    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      deleteExpense(id);
    }
  };

  const handleStatusChange = (id: string, newStatus: Expense['status']) => {
    updateExpense(id, { status: newStatus, approvedBy: newStatus === 'approved' ? 'Admin User' : undefined });
  };

  const columns: GridColDef[] = [
    { field: 'description', headerName: 'Description', width: 300, flex: 1 },
    { field: 'amount', headerName: 'Amount', width: 150, type: 'number' },
    { field: 'category', headerName: 'Category', width: 200 },
    { field: 'date', headerName: 'Date', width: 180, type: 'date' },
    { field: 'status', headerName: 'Status', width: 150 },
    { field: 'approvedBy', headerName: 'Approved By', width: 200 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <Box>
          <IconButton onClick={() => handleOpenDialog(params.row)} size="small">
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)} size="small">
            <DeleteIcon />
          </IconButton>
          {params.row.status === 'pending' && (
            <>
              <IconButton onClick={() => handleStatusChange(params.row.id as string, 'approved')} size="small">
                <ApproveIcon />
              </IconButton>
              <IconButton onClick={() => handleStatusChange(params.row.id as string, 'rejected')} size="small">
                <RejectIcon />
              </IconButton>
            </>
          )}
        </Box>
      ),
    },
  ];

  const pendingExpenses = expenses.filter(e => e.status === 'pending');
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const approvedExpenses = expenses.filter(e => e.status === 'approved');
  const totalApproved = approvedExpenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Expense Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Expense
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Expenses
              </Typography>
              <Typography variant="h4">
                ${totalExpenses.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Approved Expenses
              </Typography>
              <Typography variant="h4">
                ${totalApproved.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Pending Expenses
              </Typography>
              <Typography variant="h4">
                {pendingExpenses.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Count
              </Typography>
              <Typography variant="h4">
                {expenses.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Alerts */}
      {pendingExpenses.length > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {pendingExpenses.length} expense(s) are pending approval
        </Alert>
      )}

      <Card>
        <CardContent>
          <DataGrid
            rows={expenses}
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
          {editingExpense ? 'Edit Expense' : 'Add New Expense'}
        </DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Expense Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Amount"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as Expense['category'] })}
                >
                  <MenuItem value="labor">Labor</MenuItem>
                  <MenuItem value="materials">Materials</MenuItem>
                  <MenuItem value="equipment">Equipment</MenuItem>
                  <MenuItem value="fuel">Fuel</MenuItem>
                  <MenuItem value="utilities">Utilities</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </TextField>
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
                  select
                  label="Payment Method"
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as Expense['paymentMethod'] })}
                >
                  <MenuItem value="cash">Cash</MenuItem>
                  <MenuItem value="card">Card</MenuItem>
                  <MenuItem value="bank-transfer">Bank Transfer</MenuItem>
                  <MenuItem value="check">Check</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Vendor"
                  value={formData.vendor}
                  onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Expense['status'] })}
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                  <MenuItem value="paid">Paid</MenuItem>
                </TextField>
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
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingExpense ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Expenses;
