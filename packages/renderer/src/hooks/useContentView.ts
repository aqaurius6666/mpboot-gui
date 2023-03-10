import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Actions } from '../redux/slice/content-file.slice';
import { useElectron } from './useElectron';

export const useContentView = (): [(filePath: string) => void] => {
  const dispatch = useDispatch();
  const electron = useElectron();

  const openFile = useCallback(
    async (filePath: string) => {
      const contentFile = await electron.openContentFile(filePath);
      const content = await electron.readContentFile(filePath);
      dispatch(
        Actions.setContentFile({
          name: contentFile.fileName,
          path: contentFile.filePath,
          content,
        }),
      );
    },
    [electron],
  );

  return [openFile];
};
