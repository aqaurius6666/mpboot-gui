import React from "react";
import FolderTree from '@aqaurius6666/react-folder-tree';
import '@aqaurius6666/react-folder-tree/dist/style.css';
import "./FileTree.css";
import { useFileTree } from "../../hooks/useFileTree";


export const FileTree = () => {
    const [nodeData, onTreeStateChange, onNameClick, onContextMenu] = useFileTree()

    if (!nodeData) return <div></div>

    return (
        <div onContextMenu={onContextMenu}>
            <FolderTree
                data={nodeData}
                onChange={onTreeStateChange}
                showCheckbox={false}
                onNameClick={onNameClick}
                indentPixels={10}
                readOnly
            />
        </div>

    )
}
