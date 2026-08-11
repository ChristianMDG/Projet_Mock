import { create } from 'zustand';
import type { Route } from '../api/route.api';

interface RouteState {
  editingRoute: Route | null;
  setEditingRoute: (r: Route | null) => void;
}

export const useRouteStore = create<RouteState>((set) => ({
  editingRoute: null,
  setEditingRoute: (r) => set({ editingRoute: r }),
}));
