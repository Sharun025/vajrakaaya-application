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
import { useAppStore } from '../store';
import { Site } from '../types';

const Sites: React.FC = () => {
  const { sites, addSite, updateSite, deleteSite, projects } = useAppStore();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSite, setEditingSite] = useState<Site | null>(null);
  const [formData, setFormData] = useState<Partial<Site>>({
    name: '',
    address: '',
    projectId: '',
    area: 0,
    coordinates: {
      latitude: 0,
      longitude: 0,
    },
    status: 'active',
  });

  const handleOpenDialog = (site?: Site) => {
    if (site) {
      setEditingSite(site);
      setFormData(site);
    } else {
      setEditingSite(null);
      setFormData({
        name: '',
        address: '',
        projectId: '',
        area: 0,
        coordinates: {
          latitude: 0,
          longitude: 0,
        },
        status: 'active',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingSite(null);
  };

  const handleSubmit = () => {
    if (editingSite) {
      updateSite(editingSite.id, formData);
    } else {
      const newSite: Site = {
        ...formData as Site,
        id: Date.now().toString(),
      };
      addSite(newSite);
    }
    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this site?')) {
      deleteSite(id);
    }
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Site Name', width: 300, flex: 1 },
    { field: 'location', headerName: 'Location', width: 250 },
    { field: 'address', headerName: 'Address', width: 300 },
    { field: 'manager', headerName: 'Site Manager', width: 200 },
    { field: 'contact', headerName: 'Contact', width: 180 },
    { field: 'status', headerName: 'Status', width: 150 },
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
        <Typography variant="h4">Site Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Site
        </Button>
      </Box>

      <Card>
        <CardContent>
          <DataGrid
            rows={sites}
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
          {editingSite ? 'Edit Site' : 'Add New Site'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Site Name"
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
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Area (sq ft)"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: Number(e.target.value) })}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Site['status'] })}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Latitude"
                value={formData.coordinates?.latitude || 0}
                onChange={(e) => setFormData({
                  ...formData,
                  coordinates: {
                    ...formData.coordinates!,
                    latitude: Number(e.target.value)
                  }
                })}
                inputProps={{ step: 0.000001 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Longitude"
                value={formData.coordinates?.longitude || 0}
                onChange={(e) => setFormData({
                  ...formData,
                  coordinates: {
                    ...formData.coordinates!,
                    longitude: Number(e.target.value)
                  }
                })}
                inputProps={{ step: 0.000001 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingSite ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Sites;
