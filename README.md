# Finance Dashboard UI

A professional React-based finance dashboard with modern state management, data persistence, and role-based access control.

## 🚀 Features

### Core Functionality
- **Dashboard Overview**: Real-time summary cards for balance, income, and expenses
- **Interactive Charts**: Balance trend visualization and spending category breakdown
- **Transactions Management**: Comprehensive table with search, filtering, and sorting
- **Role-Based UI**: Viewer (read-only) and Admin (full access) modes
- **Insights Panel**: Automated analysis of spending patterns and monthly comparisons

### Professional Enhancements
- **State Management**: useReducer for complex transaction operations
- **Data Persistence**: Local storage for transactions and user preferences
- **Export Functionality**: CSV export for transaction data
- **Loading States**: Smooth UX with async operation feedback
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Dark Mode**: Theme switching with local storage persistence
- **Animations**: Subtle hover effects and fade-in transitions

## 🛠️ Tech Stack

- **React 18** with Hooks and useReducer
- **Vite** for fast development and optimized builds
- **CSS Variables** for theming and responsive design
- **Local Storage** for data persistence
- **Modern JavaScript** (ES6+)

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/rohith912191/task.git
cd task
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## 🎯 Usage

### Roles
- **Viewer**: Browse data, view charts, and insights
- **Admin**: All viewer permissions plus adding new transactions

### Key Interactions
- Switch roles using the dropdown in the header
- Toggle dark/light mode with the theme button
- Export transaction data to CSV
- Add transactions via the form (Admin only)
- Search and filter transactions in real-time

## 🏗️ Architecture

### Component Structure
```
src/
├── App.jsx              # Main application with state management
├── main.jsx             # React entry point
├── styles.css           # Global styles and themes
└── components/
    ├── SummaryCards.jsx # Financial summary display
    ├── ChartsPanel.jsx  # Trend and category visualizations
    ├── TransactionsPanel.jsx # Transaction table and form
    ├── InsightsPanel.jsx     # Automated insights
    └── RolePanel.jsx         # Role selection
```

### State Management
- **useReducer**: Handles complex transaction CRUD operations
- **useMemo**: Optimizes expensive calculations (filtering, sorting, totals)
- **useEffect**: Manages side effects (localStorage, theme application)

## 📱 Responsive Design

- Mobile-first approach with CSS Grid and Flexbox
- Adaptive layouts for tablets and desktops
- Touch-friendly interactions
- Optimized typography scaling

## 🎨 Design Philosophy

- Clean, minimal interface focused on data clarity
- Consistent spacing and typography
- Accessible color contrasts
- Subtle animations for better UX
- Professional dashboard aesthetics

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run preview` - Preview production build locally

### Code Quality
- Component-based architecture
- Proper prop validation and error handling
- Optimized re-renders with memoization
- Clean, readable code structure

## 📊 Data Model

### Transaction Schema
```javascript
{
  id: number,
  date: string,        // YYYY-MM-DD format
  amount: number,      // Positive value
  category: string,    // e.g., "Salary", "Groceries"
  type: string,        // "income" | "expense"
  description: string  // Transaction details
}
```

## 🚀 Deployment

This project is optimized for static hosting platforms:

- **Vercel**: Automatic deployments on git push
- **Netlify**: Drag-and-drop or git integration
- **GitHub Pages**: Manual build and deploy

### Build Configuration
- Output directory: `dist`
- Build command: `npm run build`
- Node.js version: 18+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is for educational and demonstration purposes.

---

Built with ❤️ using React and modern web technologies.
