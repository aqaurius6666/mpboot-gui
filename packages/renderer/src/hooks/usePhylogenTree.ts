import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Actions } from '../redux/slice/phylogen-tree.slice';
import { useElectron } from './useElectron';

const usePhylogenTreeImpl = (): [
  setNewick: (str: string) => void,
  subscribeCommand: (id: string) => void,
] => {
  const dispatch = useDispatch();
  const electron = useElectron();

  const setNewick = useCallback((newick: string) => {
    dispatch(Actions.setNewick(newick));
  }, []);

  const subscribeCommand = useCallback((commandId: string) => {
    const commandStream = electron.subscribeCommandCallbackOnFinish(commandId, async result => {
      const treeNewick = (await electron.readContentFile(result.treeFile)).trimEnd();
      setNewick(treeNewick);
      commandStream.unsubscribe();
    });
  }, []);

  return [setNewick, subscribeCommand];
};

export const usePhylogenTree = usePhylogenTreeImpl;
