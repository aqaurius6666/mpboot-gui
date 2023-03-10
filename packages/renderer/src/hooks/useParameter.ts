import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Actions } from '../redux/slice/parameter.slice';

export const useParameter = (): [(source: string) => void] => {
  const dispatch = useDispatch();

  const setSource = useCallback((source: string) => {
      dispatch(Actions.setParameter({ source }));
    }, []);

  return [setSource];
};
