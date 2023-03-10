import { MouseEventHandler } from 'react';
import { useCallback, useEffect, useState } from 'react';
import type { NodeData } from 'react-folder-tree';
import type { Directory, DirectoryTreeEvent } from '../../../common/directory-tree';
import { logger } from '../../../common/logger';
import {
  convertDirectoryToNodeData,
  findNodeDataAndUpdate,
} from '../components/FileTree/convert-directory-to-node-data';
import { useContentView } from './useContentView';
import { useElectron } from './useElectron';
import { useParameter } from './useParameter';
import { findTargetNode } from 'use-tree-state';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store/root';
import { getRelativePath } from '../utils/fs';

const unimplementedUseFileTree = (): [
  nodeData: NodeData | undefined,
  onTreeStateChange: (state: any, event: any) => void,
  onNameClick: ({
    defaultOnClick,
    nodeData,
  }: {
    defaultOnClick: () => void;
    nodeData: NodeData;
  }) => void,
  onContextMenu: MouseEventHandler<HTMLElement>,
] => {
  return [
    {} as NodeData,
    (_state: any, _event: any) => {
      return;
    },
    ({ defaultOnClick, nodeData }: { defaultOnClick: () => void; nodeData: NodeData }) => {
      defaultOnClick();
      const _ = nodeData;
      return;
    },
    (_event: any) => {
      return;
    },
  ];
};

const useFileTreeImpl = (): [
  nodeData: NodeData | undefined,
  onTreeStateChange: (state: any, event: any) => void,
  onNameClick: ({
    defaultOnClick,
    nodeData,
  }: {
    defaultOnClick: () => void;
    nodeData: NodeData;
  }) => void,
  onContextMenu: MouseEventHandler<HTMLElement>,
] => {
  const { dirPath } = useSelector((state: RootState) => state.workspace);
  const [openFile] = useContentView();
  const [setSource] = useParameter();
  const electron = useElectron();
  const [nodeData, setNodeData] = useState<NodeData>();

  useEffect(() => {
    if (!dirPath) return;
    const emitter = electron.subscribeDirectoryTree(dirPath);
    emitter.on('data', (events: DirectoryTreeEvent[]) => {
      onDirectoryTreeEvents(events);
    });
    return () => {
      emitter.unregister();
    };
  }, [dirPath, electron]);

  useEffect(() => {
    (async () => {
      if (!electron) return;

      const directory = await electron.getFirstLoadDirectoryTree(dirPath);
      setNodeData(convertDirectoryToNodeData(directory));
    })();
  }, [electron, dirPath]);

  const onDirectoryTreeEvents = useCallback(
    (events: DirectoryTreeEvent[]) => {
      if (!nodeData) return;

      const _tmp = { ...nodeData };
      let isChanged = false;
      events.forEach(event => {
        if (event.type === 'create') {
          const parentPath = electron.dirname(event.path);
          findNodeDataAndUpdate(_tmp, parentPath, found => {
            if (found.children?.findIndex(e => e.id == event.path) !== -1) {
              logger.warn('already exists create directory tree', event.path);
              return;
            }
            const _children = found.children || [];
            const nodeToPush = {
              id: event.path,
              name: electron.basename(event.path),
              isOpen: false,
              ...(event.isDirectory
                ? {
                  children: [],
                  type: 'directory',
                  explored: false,
                }
                : {
                  type: 'file',
                }),
            };
            _children.push(nodeToPush);
            _children.sort((a, b) => {
              if (a.type === 'directory' && b.type === 'file') {
                return -1;
              }
              if (a.type === 'file' && b.type === 'directory') {
                return 1;
              }
              return a.name.localeCompare(b.name);
            });
            found.children = _children;
            isChanged = true;
          });
        } else if (event.type === 'update') {
          findNodeDataAndUpdate(_tmp, event.path, found => {
            if (found.type === 'file') {
              logger.warn('skip update file directory tree', event.path);
            } else {
              logger.warn('skip update directory directory tree', event.path);
            }
          });
        } else if (event.type === 'delete') {
          const parentPath = electron.dirname(event.path);
          findNodeDataAndUpdate(_tmp, parentPath, found => {
            const _children = found.children?.filter(child => child.id !== event.path);
            if (_children?.length === found.children?.length) {
              logger.warn('not found for delete directory tree', event.path);
              return;
            }
            found.children = _children;
            isChanged = true;
          });
        }
      });
      if (isChanged) {
        setNodeData(_tmp);
      }
    },
    [JSON.stringify(nodeData), electron],
  );

  const onTreeStateChange = useCallback((state: any, event: any) => {
    logger.log('state change', { state, event });
  }, []);

  const onNameClick = useCallback(
    ({
      defaultOnClick,
      nodeData: clickedNodeData,
    }: {
      defaultOnClick: () => void;
      nodeData: NodeData;
    }) => {
      if (!nodeData) return;

      if (clickedNodeData.type === 'file') {
        openFile(clickedNodeData.id);
        setSource(clickedNodeData.id);
        return;
      }
      if (clickedNodeData.type === 'directory') {
        if (clickedNodeData.explored) {
          clickedNodeData.isOpen = !clickedNodeData.isOpen;
        } else {
          electron
            .exploreDirectory(dirPath, getRelativePath(clickedNodeData.id, dirPath))
            .then(async (data: Directory) => {
              const node = convertDirectoryToNodeData(data);
              const _tmp = { ...nodeData };
              logger.log('current nodeData', _tmp);
              findNodeDataAndUpdate(_tmp, node.id, found => {
                found.children = node.children;
                found.explored = true;
                found.isOpen = true;
              });
              setNodeData(_node => _tmp);
            });
        }
      }
      defaultOnClick();
    },
    [JSON.stringify(nodeData), electron, dirPath],
  );

  const onContextMenu: MouseEventHandler<HTMLElement> = useCallback(
    e => {
      e.preventDefault();
      const { clientX, clientY } = e;
      const targetElement = e.target as HTMLElement;
      const { folderTreePath } = targetElement.dataset;
      const node = findTargetNode(nodeData, JSON.parse(folderTreePath!));
      electron.showContentMenu({
        x: clientX,
        y: clientY,
        type: node.type == 'directory' ? 'file-tree-item-directory' : 'file-tree-item-file',
        data: node.id,
      });
    },
    [nodeData],
  );

  return [nodeData, onTreeStateChange, onNameClick, onContextMenu];
};

export const useFileTree = useFileTreeImpl;
