import { useState, useCallback } from 'react';

export const useDetailPanel = () => {
  const [detailPanelContent, setDetailPanelContent] = useState<any>(null);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState<boolean>(false);

  const openDetailPanel = useCallback((content: any) => {
    setDetailPanelContent(content);
    setIsDetailPanelOpen(true);
  }, []);

  const closeDetailPanel = useCallback(() => {
    setIsDetailPanelOpen(false);
  }, []);

  return {
    detailPanelContent,
    isDetailPanelOpen,
    openDetailPanel,
    closeDetailPanel
  };
};
