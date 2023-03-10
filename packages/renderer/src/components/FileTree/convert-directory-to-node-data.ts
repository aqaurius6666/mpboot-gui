import type { NodeData } from 'react-folder-tree';
import type { Directory } from '../../../../common/directory-tree';

export const convertDirectoryToNodeData = (directory: Directory): NodeData => {
  if (directory.children === undefined) {
    return {
      id: directory.path,
      name: directory.name,
      type: 'file',
      isOpen: false,
    };
  }
  return {
    id: directory.path,
    name: directory.name,
    children: directory.children.map(convertDirectoryToNodeData),
    type: 'directory',
    explored: false,
    isOpen: false,
  };
};

export const findNodeDataAndUpdate = (
  node: NodeData,
  path: string,
  callback: (node: NodeData) => void,
) => {
  if (!node) return;

  if (node.id === path) {
    callback(node);
  }
  if (!path.includes(node.id)) return;

  node.children?.forEach(child => {
    findNodeDataAndUpdate(child, path, callback);
  });
};
