import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IWorkspace } from '../../../common/workspace'
import { useElectron } from '../hooks/useElectron'
import { useWorkspace } from '../hooks/useWorkspace'

export const DashboardPage = () => {
    const electron = useElectron()
    const [, setWorkspace] = useWorkspace()
    const navigate = useNavigate()
    const [workspaces, setWorkspaces] = useState<IWorkspace[]>([])
    
    useEffect(() => {
        electron.listWorkspaces().then((workspaces) => {
            setWorkspaces(workspaces)
        })
    }, [])

    const onCreateWorkspaceButtonClick = (e: any) => {
        (async () => {
            const res = await electron.openDirectoryForWorkspace()
            if (res.canceled || !res.directoryPath) return

            const workspace = await electron.createWorkspace(res.directoryPath)
            setWorkspace(workspace)
            navigate("/main")
        })()
    }
    return (
        <div>
            <h1>Dashboard</h1>
            <div>
                <button onClick={e => onCreateWorkspaceButtonClick(e)}>
                    Create new workspace
                </button>
                {workspaces.map((workspace) => {
                    return (
                        <div key={workspace.id}>
                            <h3>{workspace.name}</h3>
                            <a onClick={(e) => {
                                setWorkspace(workspace)
                                navigate("/main")
                            }}>
                                Open
                            </a>
                        </div>
                    )
                })
                }
            </div>
        </div>
    )
}
