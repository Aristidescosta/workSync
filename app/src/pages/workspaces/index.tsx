import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { WorkSyncIcon } from "@/react-icons";
import { useTeamStore } from "@/src/hooks/useTeam";
import { useWorkspaceStore } from "@/src/hooks/useWorkspace";
import { WorkspaceType } from "@/src/types/WorkspaceType";
import { useEffect, useState } from "react";
export const WorkSpacesPage = () => {

    const [workspaces, setWorkspaces] = useState<WorkspaceType[]>([]);
    const team = useTeamStore(state => state.team)
    const workspace = useWorkspaceStore(state => state.workspace)
    const observingAllWorkspaces = useWorkspaceStore(state => state.observingAllWorkspaces)

    useEffect(() => {
        if (team) {
            const unsubscribe = observingAllWorkspaces(team.teamId, (workspace, isRemoving) => {
                if (workspace) {
                    setWorkspaces(state => [...state, workspace])
                }
            })

            return () => {
                setWorkspaces([])
                unsubscribe()
            }
        }
    }, [team, workspace])
    return (
        <>
            <h1 className="font-semibold text-2xl md:text-3xl lg:text-4xl mb-4">Membros da equipa</h1>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Acções</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {workspaces.map((workspace) => (
                        <TableRow key={workspace.workspaceId}>
                            <TableCell className="font-medium">{workspace.workspaceName}</TableCell>
                            <TableCell>{workspace.isClosed ? "Aberto" : "Fechado"}</TableCell>
                            <TableCell>
                                <WorkSyncIcon
                                    name="MdMoreHoriz"
                                    package="materialdesignicons"
                                    color="black"
                                    size={16}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    )
}
