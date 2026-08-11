# Dashboard 2 - Material-UI Version

This is a converted version of the original dashboard, migrated from Joy UI to Material-UI (MUI).

## Key Changes

- **UI Library**: Migrated from Joy UI to Material-UI v7
- **Components**: All components converted to use MUI components
- **Theming**: Updated to use MUI's ThemeProvider and theme system
- **Styling**: Updated sx props and styling to match MUI patterns
- **Port**: Runs on port 3002 (instead of 3001)

## Features

- **Authentication**: Login/logout functionality
- **Order Management**: Dashboard for managing orders
- **Real-time Messaging**: WebSocket-based messaging system
- **Profile Management**: User profile dashboard
- **Responsive Design**: Mobile-first responsive layout

## Tech Stack

- **React 19** - UI framework
- **Material-UI v7** - Component library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Query** - Data fetching
- **Zustand** - State management
- **React Router** - Navigation
- **WebSocket** - Real-time communication

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

Create a `.env.local` file with:

```env
VITE_API_URL=http://localhost:8080/api
VITE_DOMAIN_MAIN=localhost:8080
VITE_ENV=development
VITE_DEBUG=true
```

## Docker

```bash
# Build image
docker build -t dashboard2 .

# Run container
docker run -p 3002:3002 dashboard2
```

## Migration Notes

This dashboard maintains the same functionality as the original but uses Material-UI components instead of Joy UI. The API integration, state management, and business logic remain unchanged.

Key differences:

- Uses MUI's `ThemeProvider` instead of Joy UI's `CssVarsProvider`
- Components use MUI's component API and styling system
- Color scheme toggle is simplified (can be enhanced with MUI's theme switching)
- Layout uses MUI's `AppBar`, `Paper`, and `Card` components
