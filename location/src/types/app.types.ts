/**
 * Application layout types
 */
import React from 'react';

export interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Route configuration types
 */
export interface RouteConfig {
  path: string;
  element: React.ComponentType;
  title?: string;
  requiresAuth?: boolean;
  layout?: 'default' | 'standalone' | 'minimal';
}

/**
 * Theme-related types for layout calculations
 */
export interface LayoutSpacing {
  header: {
    xs: number;
    sm: number;
    md: number;
  };
  footer: {
    xs: number;
    sm: number;
    md: number;
  };
  container: {
    paddingTop: number;
    paddingBottom: number;
  };
}

/**
 * Navigation item types
 */
export interface NavigationItem {
  label: string;
  path: string;
  icon?: React.ComponentType;
  children?: NavigationItem[];
  requiresAuth?: boolean;
  external?: boolean;
}

/**
 * App configuration types
 */
export interface AppConfig {
  name: string;
  version: string;
  description: string;
  features: {
    authentication: boolean;
    multiLanguage: boolean;
    darkMode: boolean;
    notifications: boolean;
  };
}
