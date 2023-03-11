import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useElectron } from '../../hooks/useElectron';
import { useLog } from '../../hooks/useLog';
import { usePhylogenTree } from '../../hooks/usePhylogenTree';
import { RootState } from '../../redux/store/root';
import { getRelativePath } from '../../utils/fs';

export const ParameterView = () => {
    const parameter = useSelector((state: RootState) => state.parameter)
    const { dirPath } = useSelector((state: RootState) => state.workspace)
    const [subscribeLog] = useLog();
    const [, subscribeCommand] = usePhylogenTree()
    const electron = useElectron()

    const onRunButtonSubmit: React.FormEventHandler<HTMLButtonElement> = useCallback((e) => {
        e.preventDefault();
        (async () => {
            const { logFile, commandId } = await electron.executeCommand(parameter)
            subscribeLog(logFile)
            subscribeCommand(commandId)
        })()
    }, [parameter])

    const relativeSourcePath = useMemo(() => getRelativePath(parameter.source, dirPath), [parameter.source, dirPath])

    return (
        <>
            <button id="run-button" onClick={onRunButtonSubmit}>Run</button>
            {/* <input id="source-input" type="text" readOnly>{parameter.source}</input> */}
            <div>{relativeSourcePath}</div>
        </>
    )
}