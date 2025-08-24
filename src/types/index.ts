// Site/Project Management Types
export interface Project {
  id: string;
  name: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date;
  status: 'planning' | 'active' | 'completed' | 'on-hold';
  budget: number;
  manager: string;
  client: string;
  progress: number;
}

export interface Site {
  id: string;
  name: string;
  address: string;
  projectId: string;
  area: number;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  status: 'active' | 'inactive';
}

// Vehicle & Equipment Management Types
export interface Vehicle {
  id: string;
  name: string;
  type: 'truck' | 'excavator' | 'crane' | 'bulldozer' | 'loader' | 'other';
  model: string;
  year: number;
  licensePlate: string;
  status: 'available' | 'in-use' | 'maintenance' | 'retired';
  currentLocation: string;
  assignedProject?: string;
  lastMaintenance: Date;
  nextMaintenance: Date;
  fuelLevel: number;
  mileage: number;
}

export interface Equipment {
  id: string;
  name: string;
  type: 'tools' | 'machinery' | 'safety' | 'other';
  category: string;
  status: 'available' | 'in-use' | 'maintenance' | 'retired';
  assignedProject?: string;
  assignedTo?: string;
  purchaseDate: Date;
  warrantyExpiry: Date;
  lastInspection: Date;
  nextInspection: Date;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
}

// Material & Inventory Management Types
export interface Material {
  id: string;
  name: string;
  category: string;
  unit: string;
  currentStock: number;
  minimumStock: number;
  maximumStock: number;
  unitPrice: number;
  supplier: string;
  location: string;
  lastUpdated: Date;
  expiryDate?: Date;
  status: 'available' | 'low-stock' | 'out-of-stock';
}

export interface InventoryTransaction {
  id: string;
  materialId: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  date: Date;
  projectId?: string;
  reason: string;
  performedBy: string;
  notes?: string;
}

// Expense & Cost Booking Types
export interface Expense {
  id: string;
  title: string;
  description: string;
  amount: number;
  category: 'labor' | 'materials' | 'equipment' | 'fuel' | 'utilities' | 'other';
  projectId: string;
  date: Date;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  approvedBy?: string;
  receipt?: string;
  vendor: string;
  paymentMethod: 'cash' | 'card' | 'bank-transfer' | 'check';
}

export interface CostCenter {
  id: string;
  name: string;
  description: string;
  budget: number;
  spent: number;
  projectId: string;
  manager: string;
}

// User and Authentication Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'supervisor' | 'worker';
  department: string;
  phone: string;
  avatar?: string;
}

// Dashboard and Analytics Types
export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  totalVehicles: number;
  availableVehicles: number;
  totalMaterials: number;
  lowStockMaterials: number;
  totalExpenses: number;
  monthlyExpenses: number;
}

export interface ChartData {
  name: string;
  value: number;
  date?: string;
}
