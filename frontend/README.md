# Expense Tracker Frontend

A modern React application for tracking expenses with full CRUD operations, dashboard visualization, and currency conversion features.

## Features

- ✅ Full CRUD operations for expenses
- ✅ Beautiful, responsive UI
- ✅ Dashboard with charts and statistics
- ✅ Currency converter (third-party API integration)
- ✅ Real-time data updates

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Package Manager**: Bun
- **Language**: TypeScript
- **Linter/Formatter**: Biome
- **State Management**: TanStack Query
- **Routing**: React Router
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Date Handling**: date-fns

## Local Setup

### Prerequisites

- Bun (JavaScript runtime and package manager)
- Backend API running (see backend README)

### Installation

1. **Install Bun** (if not already installed):
```bash
curl -fsSL https://bun.sh/install | bash
```

2. Navigate to the frontend directory:
```bash
cd frontend
```

3. Install dependencies:
```bash
bun install
```

4. Set up environment variables:
```bash
cp ../.env.example .env
# Or create frontend/.env with: VITE_API_URL=http://localhost:8000
```

5. Start the development server:
```bash
bun run dev
```

The application will be available at `http://localhost:5173`

## Building for Production

```bash
bun run build
```

The built files will be in the `dist` directory.

## Formatting and Linting

This project uses [Biome](https://biomejs.dev/) for formatting and linting.

```bash
# Check formatting and linting
bun run check

# Auto-fix all issues
bun run check:fix

# Format code only
bun run format

# Lint only
bun run lint
# Or auto-fix linting issues
bun run lint:fix
```

Biome configuration is in `biome.json`.

## Environment Variables

- `VITE_API_URL`: Backend API URL (default: http://localhost:8000)

## Project Structure

```
src/
├── api/           # API client functions
├── components/    # React components
├── types/         # TypeScript type definitions
├── App.tsx        # Main app component
├── App.css        # App styles
├── main.tsx       # Entry point
└── index.css     # Global styles
```

## Features Overview

### Expense Management
- View all expenses in a table
- Create new expenses
- Edit existing expenses
- Delete expenses
- Filter by category

### Dashboard
- Total expenses summary
- Category breakdown (pie chart)
- Monthly trends (bar chart)
- Average expense calculation

### Currency Converter
- Convert between different currencies
- Real-time exchange rates
- Integration with Exchange Rate API

## Testing the Application

### UI Flow to Test CRUD

1. **Create Expense**:
   - Click "Add Expense" button
   - Fill in the form (title, amount, category, date)
   - Click "Create Expense"
   - Verify the expense appears in the list

2. **View Expenses**:
   - Expenses are displayed in a table on the home page
   - Each expense shows: title, amount, category, date, description

3. **Update Expense**:
   - Click "Edit" button on any expense
   - Modify the fields
   - Click "Update Expense"
   - Verify changes are reflected in the list

4. **Delete Expense**:
   - Click "Delete" button on any expense
   - Confirm deletion
   - Verify expense is removed from the list

### Dashboard/Visualization Page

- Navigate to "Dashboard" from the navigation bar
- View statistics cards (Total Expenses, Total Count, Average Expense)
- View category breakdown pie chart
- View monthly trends bar chart
- Add/update/delete expenses and refresh dashboard to see changes

### Third-Party API Feature

- Navigate to "Currency Converter" from the navigation bar
- Enter an amount
- Select "From Currency" and "To Currency"
- Click "Convert"
- View the conversion result with exchange rate
- This demonstrates integration with Exchange Rate API

## Deployment

The frontend can be deployed to various platforms:

- **Vercel**: Connect your GitHub repo and deploy automatically
- **Netlify**: Drag and drop the `dist` folder or connect GitHub
- **AWS S3 + CloudFront**: Upload build files to S3 and serve via CloudFront
- **Azure Static Web Apps**: Deploy via GitHub Actions
- **GitHub Pages**: Deploy the `dist` folder to GitHub Pages

Make sure to:
1. Set `VITE_API_URL` to your production backend URL
2. Build the project before deploying: `npm run build`
3. Configure CORS on the backend to allow your frontend domain

## License

MIT
