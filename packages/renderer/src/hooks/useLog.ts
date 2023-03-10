import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { singletonHook } from 'react-singleton-hook';
import { Actions } from '../redux/slice/log.slice';
import { useElectron } from './useElectron';
const unimplementedUseLog = (): [
  subscribeLog: (filePath: string) => void,
  reloadLog: (filePath: string) => void,
] => {
  return [
    (_filePath: string) => {
      return;
    },
    (_filePath: string) => {
      return;
    },
  ];
};
const useLogImpl = (): [
  subscribeLog: (filePath: string) => void,
  reloadLog: (filePath: string) => void,
] => {
  // const logState = useSelector((state: RootState) => state.log);
  const dispatch = useDispatch();
  const electron = useElectron();
  const [dataToBeFlushed, setDataToBeFlushed] = useState<string[]>([]);

  /**
   * Render whenever log file changes
   */
  const subscribeLog = useCallback((logFile : string) => {
    const logStream = electron.subscribeLog(logFile);
    dispatch(
      Actions.appendLogData({
        logFile: logFile,
        logData: [],
      }),
    );
    logStream.on('data', (data: string) => {
      dispatch(
        Actions.appendLogData({
          logData: [data],
        }),
      );
    });
  }, []);

  /**
   * Flush data to redux store after 250ms of inactivity
   */
  // useEffect(() => {
  //   if (dataToBeFlushed.length === 0) {
  //     return;
  //   }
  //   const timeout = setTimeout(() => {
  //     dispatch(
  //       Actions.appendLogData({
  //         logData: dataToBeFlushed,
  //       }),
  //     );
  //     setDataToBeFlushed([]);
  //   }, 250);
  //   return () => {
  //     clearTimeout(timeout);
  //   };
  // }, [dataToBeFlushed]);

  // const onLogStreamEvent = useCallback((data: string) => {
  //   setDataToBeFlushed(d => [...d, data]);
  // }, []);

  // useEffect(() => {
  //   const logStream = electron.subscribeLog(logState.logFile);
  //   logStream.on('data', onLogStreamEvent);
  //   return () => {
  //     logStream.unregister();
  //   };
  // }, [logState.logFile, counter]);

  const reloadLog = useCallback((logFile : string) => {
    electron.unsubscribeLog(logFile);
    subscribeLog(logFile)
  }, []);

  return [subscribeLog, reloadLog];
};

export const useLog = singletonHook(unimplementedUseLog, useLogImpl);
