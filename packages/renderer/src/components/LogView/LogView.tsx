import React, { FC, useCallback, useEffect, useState } from "react";
import './LogView.css';
import "@patternfly/react-core/dist/styles/base.css";
import { useElectron } from "../../hooks/useElectron";
import { LogViewer, LogViewerSearch } from "@patternfly/react-log-viewer";
import { Toolbar, ToolbarContent, ToolbarItem } from "@patternfly/react-core";
import { useLog } from "../../hooks/useLog";
import { usePhylogenTree } from "../../hooks/usePhylogenTree";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/root";

export interface LogViewProps {

}

export const LogView: FC = (props: LogViewProps) => {
    const log = useSelector((state: RootState) => state.log)
    const [, reloadLog] = useLog()

    const onClickHandler = useCallback((_e: any) => {
        reloadLog(log.logFile)
    }, [reloadLog, log.logFile])

    return (
        <>
            <button onClick={onClickHandler}>Reload log</button>
            <div style={{ height: "90%" }}>
                <LogViewer
                    hasLineNumbers={false}
                    data={log.logData}
                    theme="light"
                    isTextWrapped={true}
                    height="100%"
                    scrollToRow={log.logData.length}
                    toolbar={
                        <Toolbar>
                            <ToolbarContent>
                                <ToolbarItem>
                                    <LogViewerSearch minSearchChars={3} placeholder="Search value" />
                                </ToolbarItem>
                            </ToolbarContent>
                        </Toolbar>
                    }
                />
            </div>
        </>


    );
};