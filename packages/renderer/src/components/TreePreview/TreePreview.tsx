import React, { FC, useEffect, useRef } from 'react';
import "./TreePreview.css";
import { usePhylogenTree } from '../../hooks/usePhylogenTree';
// @ts-ignore
import * as phylotree from 'phylotree';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store/root';

export interface TreePreviewProps {
    newick?: string,
    width?: number,
    height?: number,
    mode: "radial" | "normal"
}

export interface TreePreviewWithSizeProps {
    width?: string,
    height?: string,
    mode: "radial" | "normal"
}


export const TreePreview: FC<TreePreviewProps> = ({ width, height, mode = "normal" }) => {
    const { newick } = useSelector((state: RootState) => state.phylogenTree)
    const [treeRenderHtml, setTreeRenderHtml] = React.useState('<div></div>')
    useEffect(() => {
        if (!newick) return
        const _tree = new phylotree.phylotree(newick);
        const renderOptions: any = {
            width: width,
            height: height,
            container: "#tree-container",
            'left-right-spacing': 'fit-to-size',
            'top-bottom-spacing': 'fit-to-size',
            'align-tips': true,
        }
        if (mode === "radial") {
            _tree.render(renderOptions)
            _tree.display.radial(true).update()
        } else {
            _tree.render(renderOptions)
        }

        var tmp = document.createElement("div");

        tmp.appendChild(_tree.display.show());
        setTreeRenderHtml(tmp.innerHTML);
    }, [newick, width, height])

    if (!newick) {
        return (
            <div>
                No tree file available
            </div>
        )
    }
    return (
        <>
            <div dangerouslySetInnerHTML={{ __html: treeRenderHtml }} id="tree-container"></div>
        </>

    )
}


export const TreePreviewWithSize: FC<TreePreviewWithSizeProps> = ({ mode, height, width }) => {
    const ref = useRef<HTMLDivElement>(null);

    return (
        <div ref={ref} style={{ width: width, height: height }}>
            <TreePreview width={ref.current?.offsetWidth} height={ref.current?.offsetHeight} mode={mode} />
        </div>
    )
}