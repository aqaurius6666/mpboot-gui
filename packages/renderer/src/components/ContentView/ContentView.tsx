import React, { useEffect, useMemo } from 'react';
import { useContentView } from '../../hooks/useContentView';
import { PhyRenderedContent } from './PhyRenderedContent';
import { TxtRenderedContent } from './TxtRenderedContent';
import "./ContentView.css"
import { RootState } from '../../redux/store/root';
import { useSelector } from 'react-redux';

export const ContentView = () => {
    const contentFile = useSelector((state: RootState) => state.contentFile)
    const memoContent = useMemo(() => {
        return contentFile.content
    }, [contentFile])

    const renderComponent = useMemo(() => {
        if (!memoContent) {
            return (
                <div>
                    <h1>File is empty!</h1>
                </div>
            )
        }
        if (contentFile.name.endsWith('.phy')) {
            return (
                <PhyRenderedContent content={memoContent} className="content-view" />
            )
        }
        return (
            <TxtRenderedContent content={memoContent} className="content-view" />
        )
    }, [memoContent])
    if (!contentFile.name) {
        return (
            <div>
                <h1>You can open file in explorer to start working!</h1>
            </div>
        )
    }

    return (
        <div style={{height: "100%"}}>
            {renderComponent}
        </div>
    )
}

