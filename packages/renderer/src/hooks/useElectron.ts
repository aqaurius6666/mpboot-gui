import { useEffect, useMemo } from 'react';
import { singletonHook } from 'react-singleton-hook';
import { unimplementedExposedElectron } from '../../../common/electron';
import type { ContextMenuType } from '../../../common/menu';

export const useElectronImpl = () => {
  const electron = useMemo(() => {
    return window.electron;
  }, []);

  useEffect(() => {
    const listener = (e: MouseEvent) => {
      e.preventDefault();
      if (!e.target) return;
      const target = e.target as HTMLElement;
      if (!target.dataset.contextMenuType || !target.dataset.contextMenuData) return;

      electron.showContentMenu({
        x: e.clientX,
        y: e.clientY,
        type: target.dataset.contextMenuType as ContextMenuType,
        data: target.dataset.contextMenuData,
      });
    };
    window.addEventListener('contextmenu', listener);

    return () => {
      window.removeEventListener('contextmenu', listener);
    };
  }, []);

  return electron;
};

export const useElectron = singletonHook(unimplementedExposedElectron, useElectronImpl);
// export const useElectron = useElectronImpl;
