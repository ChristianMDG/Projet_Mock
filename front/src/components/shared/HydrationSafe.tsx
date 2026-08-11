import React, { useState, useEffect, ReactNode } from 'react';

interface HydrationSafeProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Component that prevents hydration mismatches by only rendering children after hydration
 */
export const HydrationSafe: React.FC<HydrationSafeProps> = ({ children, fallback = null }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (hasMounted) {
    return <>{children}</>;
  }
  return <>{fallback}</>;
};

export default HydrationSafe;
