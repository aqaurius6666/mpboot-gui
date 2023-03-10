import React, { FC, useEffect, useRef } from 'react';
// @ts-ignore
import * as phylotree from 'phylotree';
// @ts-ignore
import "./phylotree.css";
import { usePhylogenTree } from '../../hooks/usePhylogenTree';
import { logger } from '../../../../common/logger';
import { PhylotreeVisualization } from 'phylotree-visualization-demo';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store/root';

export interface TreeViewProps {
    newick?: string,
    width?: number,
    height?: number,
    mode: "radial" | "normal"
}

export interface TreeViewWithSizeProps {
    width?: string,
    height?: string,
    mode: "radial" | "normal"
}


export const TreeView: FC<TreeViewProps> = ({ width, height, mode = "normal" }) => {
    const { newick } = useSelector((state: RootState) => state.phylogenTree)

    return (
        <PhylotreeVisualization 
            input={newick}
            defaultWidth={width}
        />
    )
}


export const TreeViewWithSize : FC<TreeViewWithSizeProps> = ({ mode, height, width}) => {
    const ref = useRef<HTMLDivElement>(null);
  
    return (
        <div ref={ref} style={{width: width, height: height}}>
            <TreeView width={ref.current?.offsetWidth} height={ref.current?.offsetHeight} mode={mode} />
        </div>
    )
}