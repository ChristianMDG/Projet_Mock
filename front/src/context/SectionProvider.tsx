import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { DynamicPageSection } from '@/api/dynamic-page.api';
import { useDynamicPageBySlug } from '@/hooks/dynamic-page.hooks';
import { PageLoader } from '@/components/shared/PageLoader';
import { SectionType } from '@/constants/section.types';

interface SectionProviderProps {
  children: React.ReactNode;
}

interface SectionContextValue {
  isLoading: boolean;
  getSectionByType: <T extends DynamicPageSection = DynamicPageSection>(sectionType: SectionType) => T | undefined;
}

const SectionContext = createContext<SectionContextValue | undefined>(undefined);

export const useSectionContext = () => {
  const context = useContext(SectionContext);
  if (context) return context;
  throw new Error('useSectionContext must be used within a SectionProvider');
};

export const SectionProvider: React.FC<SectionProviderProps> = ({ children }) => {
  const { data: sharedSections, isLoading } = useDynamicPageBySlug('page-template');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sectionsByType = useMemo(
    () =>
      Object.fromEntries(
        sharedSections?.data?.sections?.map(section => [section.__component, section]) ?? [],
      ) as Record<string, DynamicPageSection>,
    [sharedSections?.data?.sections],
  );

  const getSectionByType = <T extends DynamicPageSection = DynamicPageSection>(
    sectionType: SectionType,
  ): T | undefined => sectionsByType[sectionType] as T | undefined;

  const contextValue = useMemo(
    () => ({ getSectionByType, isLoading: !mounted || isLoading }),
    [sectionsByType, isLoading, mounted],
  );

  if (mounted && isLoading) {
    return <PageLoader fullScreen />;
  }

  return <SectionContext.Provider value={contextValue}>{children}</SectionContext.Provider>;
};
