import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { singletonHook } from 'react-singleton-hook';
import { Actions } from '../redux/slice/phylogen-tree.slice';
import type { RootState } from '../redux/store/root';
import { useElectron } from './useElectron';

const initialUsePhylogenTree = (): [
  setNewick: (str: string) => void,
  subscribeCommand: (id: string) => void,
] => {
  const setNewick = (_str: string) => {
    return;
  }
  const subscribeCommand = (_id: string) => {
    return;
  }
  return [setNewick, subscribeCommand];
};

const usePhylogenTreeImpl = (): [
  setNewick: (str: string) => void,
  subscribeCommand: (id: string) => void,
] => {
  const dispatch = useDispatch();
  const electron = useElectron();

  const setNewick = useCallback((newick: string) => {
    dispatch(Actions.setNewick(newick));
  }, []);


  const subscribeCommand = useCallback(
    (commandId: string) => {
      const commandStream = electron.subscribeCommandCallbackOnFinish(commandId, async result => {
        const treeNewick = (await electron.readContentFile(result.treeFile)).trimEnd();
        setNewick(treeNewick);
        commandStream.unsubscribe();
      });
    },
    [],
  );

  return [setNewick, subscribeCommand];
};

export const usePhylogenTree = usePhylogenTreeImpl;
