# Vajrakaaya Application

A comprehensive web-based project management system built with React, TypeScript, and Material-UI.

## Features

### 1. Site/Project Management
- Create and manage projects with detailed information
- Track project progress, budget, and timelines
- Assign managers and clients to projects
- Monitor project status (Planning, Active, Completed, On Hold)

### 2. Vehicle & Equipment Management
- Manage fleet of vehicles (trucks, excavators, cranes, etc.)
- Track vehicle status, maintenance schedules, and fuel levels
- Equipment inventory management with condition tracking
- Assignment of vehicles and equipment to projects

### 3. Material & Inventory Management
- Comprehensive material tracking with stock levels
- Minimum and maximum stock alerts
- Inventory transactions (in, out, adjustments)
- Supplier and location management
- Expiry date tracking for perishable materials

### 4. Expense & Cost Booking
- Expense tracking with approval workflow
- Cost center management with budget tracking
- Multiple payment methods and vendor management
- Expense categorization and project allocation

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **UI Framework**: Material-UI (MUI) v5
- **State Management**: Zustand
- **Routing**: React Router v6
- **Data Grid**: MUI X Data Grid
- **Charts**: Recharts
- **Date Handling**: date-fns
- **Build Tool**: Create React App

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd vajrakaaya-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Layout.tsx      # Main layout with navigation
├── pages/              # Page components
│   ├── Dashboard.tsx   # Main dashboard with analytics
│   ├── Projects.tsx    # Project management
│   ├── Sites.tsx       # Site management
│   ├── Vehicles.tsx    # Vehicle management
│   ├── Equipment.tsx   # Equipment management
│   ├── Materials.tsx   # Material management
│   ├── Inventory.tsx   # Inventory transactions
│   ├── Expenses.tsx    # Expense management
│   ├── CostCenters.tsx # Cost center management
│   └── Users.tsx       # User management
├── store/              # State management
│   └── index.ts        # Zustand store configuration
├── types/              # TypeScript type definitions
│   └── index.ts        # All type interfaces
├── theme/              # UI theme configuration
│   └── index.ts        # Material-UI theme
├── App.tsx             # Main application component
└── index.tsx           # Application entry point
```

## Key Features

### Dashboard
- Real-time statistics and KPIs
- Interactive charts and graphs
- Project progress overview
- Alerts and notifications

### Data Management
- Full CRUD operations for all entities
- Advanced filtering and sorting
- Bulk operations support
- Data validation and error handling

### User Interface
- Modern, responsive design
- Dark theme optimized for professional use
- Mobile-friendly interface
- Intuitive navigation

### Analytics
- Project status distribution
- Expense trends and analysis
- Vehicle utilization metrics
- Material stock levels

## Data Models

The application includes comprehensive data models for:

- **Projects**: Name, description, location, budget, progress, status
- **Sites**: Address, coordinates, area, project association
- **Vehicles**: Type, model, status, maintenance, fuel levels
- **Equipment**: Category, condition, assignment, inspection dates
- **Materials**: Stock levels, pricing, suppliers, expiry dates
- **Expenses**: Amount, category, approval status, payment method
- **Users**: Roles, departments, contact information

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please contact the development team or create an issue in the repository.
