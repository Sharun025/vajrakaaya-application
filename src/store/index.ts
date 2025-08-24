import { create } from 'zustand';
import { 
  Project, 
  Site, 
  Vehicle, 
  Equipment, 
  Material, 
  InventoryTransaction, 
  Expense, 
  CostCenter,
  User,
  DashboardStats 
} from '../types';

interface AppState {
  // Data
  projects: Project[];
  sites: Site[];
  vehicles: Vehicle[];
  equipment: Equipment[];
  materials: Material[];
  inventoryTransactions: InventoryTransaction[];
  expenses: Expense[];
  costCenters: CostCenter[];
  users: User[];
  
  // UI State
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  
  setSites: (sites: Site[]) => void;
  addSite: (site: Site) => void;
  updateSite: (id: string, updates: Partial<Site>) => void;
  deleteSite: (id: string) => void;
  
  setVehicles: (vehicles: Vehicle[]) => void;
  addVehicle: (vehicle: Vehicle) => void;
  updateVehicle: (id: string, updates: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  
  setEquipment: (equipment: Equipment[]) => void;
  addEquipment: (equipment: Equipment) => void;
  updateEquipment: (id: string, updates: Partial<Equipment>) => void;
  deleteEquipment: (id: string) => void;
  
  setMaterials: (materials: Material[]) => void;
  addMaterial: (material: Material) => void;
  updateMaterial: (id: string, updates: Partial<Material>) => void;
  deleteMaterial: (id: string) => void;
  
  setInventoryTransactions: (transactions: InventoryTransaction[]) => void;
  addInventoryTransaction: (transaction: InventoryTransaction) => void;
  
  setExpenses: (expenses: Expense[]) => void;
  addExpense: (expense: Expense) => void;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  
  setCostCenters: (costCenters: CostCenter[]) => void;
  addCostCenter: (costCenter: CostCenter) => void;
  updateCostCenter: (id: string, updates: Partial<CostCenter>) => void;
  deleteCostCenter: (id: string) => void;
  
  setUsers: (users: User[]) => void;
  addUser: (user: User) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  setCurrentUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Computed values
  getDashboardStats: () => DashboardStats;
  getProjectsByStatus: (status: Project['status']) => Project[];
  getVehiclesByStatus: (status: Vehicle['status']) => Vehicle[];
  getMaterialsByStatus: (status: Material['status']) => Material[];
  getExpensesByProject: (projectId: string) => Expense[];
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  projects: [],
  sites: [],
  vehicles: [],
  equipment: [],
  materials: [],
  inventoryTransactions: [],
  expenses: [],
  costCenters: [],
  users: [],
  currentUser: null,
  isLoading: false,
  error: null,
  
  // Project actions
  setProjects: (projects) => set({ projects }),
  addProject: (project) => set((state) => ({ 
    projects: [...state.projects, project] 
  })),
  updateProject: (id, updates) => set((state) => ({
    projects: state.projects.map(p => 
      p.id === id ? { ...p, ...updates } : p
    )
  })),
  deleteProject: (id) => set((state) => ({
    projects: state.projects.filter(p => p.id !== id)
  })),
  
  // Site actions
  setSites: (sites) => set({ sites }),
  addSite: (site) => set((state) => ({ 
    sites: [...state.sites, site] 
  })),
  updateSite: (id, updates) => set((state) => ({
    sites: state.sites.map(s => 
      s.id === id ? { ...s, ...updates } : s
    )
  })),
  deleteSite: (id) => set((state) => ({
    sites: state.sites.filter(s => s.id !== id)
  })),
  
  // Vehicle actions
  setVehicles: (vehicles) => set({ vehicles }),
  addVehicle: (vehicle) => set((state) => ({ 
    vehicles: [...state.vehicles, vehicle] 
  })),
  updateVehicle: (id, updates) => set((state) => ({
    vehicles: state.vehicles.map(v => 
      v.id === id ? { ...v, ...updates } : v
    )
  })),
  deleteVehicle: (id) => set((state) => ({
    vehicles: state.vehicles.filter(v => v.id !== id)
  })),
  
  // Equipment actions
  setEquipment: (equipment) => set({ equipment }),
  addEquipment: (equipment) => set((state) => ({ 
    equipment: [...state.equipment, equipment] 
  })),
  updateEquipment: (id, updates) => set((state) => ({
    equipment: state.equipment.map(e => 
      e.id === id ? { ...e, ...updates } : e
    )
  })),
  deleteEquipment: (id) => set((state) => ({
    equipment: state.equipment.filter(e => e.id !== id)
  })),
  
  // Material actions
  setMaterials: (materials) => set({ materials }),
  addMaterial: (material) => set((state) => ({ 
    materials: [...state.materials, material] 
  })),
  updateMaterial: (id, updates) => set((state) => ({
    materials: state.materials.map(m => 
      m.id === id ? { ...m, ...updates } : m
    )
  })),
  deleteMaterial: (id) => set((state) => ({
    materials: state.materials.filter(m => m.id !== id)
  })),
  
  // Inventory transaction actions
  setInventoryTransactions: (transactions) => set({ inventoryTransactions: transactions }),
  addInventoryTransaction: (transaction) => set((state) => ({ 
    inventoryTransactions: [...state.inventoryTransactions, transaction] 
  })),
  
  // Expense actions
  setExpenses: (expenses) => set({ expenses }),
  addExpense: (expense) => set((state) => ({ 
    expenses: [...state.expenses, expense] 
  })),
  updateExpense: (id, updates) => set((state) => ({
    expenses: state.expenses.map(e => 
      e.id === id ? { ...e, ...updates } : e
    )
  })),
  deleteExpense: (id) => set((state) => ({
    expenses: state.expenses.filter(e => e.id !== id)
  })),
  
  // Cost center actions
  setCostCenters: (costCenters) => set({ costCenters }),
  addCostCenter: (costCenter) => set((state) => ({ 
    costCenters: [...state.costCenters, costCenter] 
  })),
  updateCostCenter: (id, updates) => set((state) => ({
    costCenters: state.costCenters.map(c => 
      c.id === id ? { ...c, ...updates } : c
    )
  })),
  deleteCostCenter: (id) => set((state) => ({
    costCenters: state.costCenters.filter(c => c.id !== id)
  })),
  
  // User actions
  setUsers: (users) => set({ users }),
  addUser: (user: User) => set((state) => ({ 
    users: [...state.users, user] 
  })),
  updateUser: (id: string, updates: Partial<User>) => set((state) => ({
    users: state.users.map(u => 
      u.id === id ? { ...u, ...updates } : u
    )
  })),
  deleteUser: (id: string) => set((state) => ({
    users: state.users.filter(u => u.id !== id)
  })),
  setCurrentUser: (user) => set({ currentUser: user }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  
  // Computed values
  getDashboardStats: () => {
    const state = get();
    return {
      totalProjects: state.projects.length,
      activeProjects: state.projects.filter(p => p.status === 'active').length,
      totalVehicles: state.vehicles.length,
      availableVehicles: state.vehicles.filter(v => v.status === 'available').length,
      totalMaterials: state.materials.length,
      lowStockMaterials: state.materials.filter(m => m.status === 'low-stock').length,
      totalExpenses: state.expenses.reduce((sum, e) => sum + e.amount, 0),
      monthlyExpenses: state.expenses
        .filter(e => {
          const now = new Date();
          const expenseDate = new Date(e.date);
          return expenseDate.getMonth() === now.getMonth() && 
                 expenseDate.getFullYear() === now.getFullYear();
        })
        .reduce((sum, e) => sum + e.amount, 0)
    };
  },
  
  getProjectsByStatus: (status) => {
    const state = get();
    return state.projects.filter(p => p.status === status);
  },
  
  getVehiclesByStatus: (status) => {
    const state = get();
    return state.vehicles.filter(v => v.status === status);
  },
  
  getMaterialsByStatus: (status) => {
    const state = get();
    return state.materials.filter(m => m.status === status);
  },
  
  getExpensesByProject: (projectId) => {
    const state = get();
    return state.expenses.filter(e => e.projectId === projectId);
  }
}));
