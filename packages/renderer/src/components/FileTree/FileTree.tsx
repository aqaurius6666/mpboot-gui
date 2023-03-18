import React from "react";
import FolderTree from '@aqaurius6666/react-folder-tree';
import '@aqaurius6666/react-folder-tree/dist/style.css';
import "./FileTree.css";
import { useFileTree } from "../../hooks/useFileTree";
import { logger } from "../../../../common/logger";


export const FileTree = () => {
    const [nodeData, onTreeStateChange, onNameClick, onContextMenu] = useFileTree()

    if (!nodeData) return <div></div>

    return (
        <div onContextMenu={onContextMenu}>
            <FolderTree
                data={nodeData}
                onChange={onTreeStateChange}
                showCheckbox={true}
                onNameClick={onNameClick}
                indentPixels={10}
            />
        </div>

    )
}
