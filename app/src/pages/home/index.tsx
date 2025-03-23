import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { WorkSyncIcon } from "@/react-icons"
import { useUserSessionStore } from "@/src/hooks"
import { useTeamStore } from "@/src/hooks/useTeam"
import { TeamType } from "@/src/types/TeamType"
import { useEffect, useState } from "react"
import { redirect, useNavigate } from "react-router-dom"
import { CardTeam } from "./components/CardTeam"
import { Loader2 } from "lucide-react"
import { WorkSyncModal } from "@/src/components/modals"
import { CreateTeamPage } from "../Authentication/CreateTeamPage"
import { useWorkspaceStore } from "@/src/hooks/useWorkspace"
import { ITEMS } from "@/src/utils/constants"

export const Home = () => {
    const user = useUserSessionStore(state => state.user)
    const logout = useUserSessionStore(state => state.logout)
    const observingUserData = useUserSessionStore(state => state.observingUserData)
    const [filterTeamName, setFilterTeamName] = useState("")

    const session = useUserSessionStore(state => state.userSession)


    const teams = useTeamStore(state => state.teams)
    const loadingTeams = useTeamStore(state => state.loadingTeams)

    const updateCurrentTeam = useTeamStore(state => state.updateCurrentTeam)
    const team = useTeamStore(state => state.team)
    const workspace = useWorkspaceStore(state => state.workspace)
    const navigate = useNavigate();

    useEffect(() => {
        if (!session) {
            redirect("/auth")
        }

        if (session) {
            const userSubscribe = observingUserData(session.id)
            return () => {
                userSubscribe()
            }
        }

    }, [session])

    useEffect(() => {
        if (team) {
            if (workspace) {
                navigate(`/home/${team.teamId}/${encodeURI(workspace.workspaceName)}/${encodeURI(ITEMS[0].url.toLowerCase())}`)
            } else {
                navigate(`/home/${team.teamId}`)
            }
        } else {
            navigate("/home")
        }
    }, [workspace, team])

    async function handleLogout() {
        await logout()
    }

    function handleOnNavigateToTeam(team?: TeamType) {
        if (team) {
            updateCurrentTeam(team)
            navigate(`/home/${team.teamId}`)
        } else {
            navigate("/home")
        }
    }

    console.log("MINHAS EQUIPAS: ", teams)

    const [isModalOpen, setIsOpenModal] = useState(false)


    const onCloseModal = () => {
        setIsOpenModal(false)
    }
    const onOpenModal = () => {
        setIsOpenModal(true)
    }

    return (
        <div className="w-full h-full">
            <div className="flex w-full flex-col md:flex-row md:items-center md:justify-between">
                <Label className="text-center text-2xl">Minhas equpas</Label>
                <div className="grid md:flex mt-2 w-full max-w-sm items-center gap-1.5">
                    <Input type="serach" id="serach" onChange={(e) => setFilterTeamName(e.target.value)} placeholder="Pesquisa por uma equipa" />
                    <Button variant={"secondary"} onClick={onOpenModal}>
                        <WorkSyncIcon name="FaPlus" package="fontawesome6" color="white" />
                        Adicionar
                    </Button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-4 gap-4">
                {
                    loadingTeams ?
                        (
                            <div className="flex flex-col items-center justify-center">
                                <Loader2 className="animate-spin" />
                                <Label>Carregando as equpas</Label>
                            </div>
                        )
                        :
                        teams
                            .filter(team =>
                                team.teamName.toLowerCase().includes(filterTeamName.toLowerCase()) &&
                                team.owner.session.id === user?.session.id
                            )
                            .map((team, index) => (
                                <CardTeam
                                    key={index}
                                    team={team}
                                    onClick={handleOnNavigateToTeam}
                                />
                            ))
                }
            </div>
            <WorkSyncModal
                isOpen={isModalOpen}
                onClose={onCloseModal}
                title='Criar nova equipa'
                subtitle='Com uma ou mais equipas criadas, você será capaz de gerir os projectos e os colaboradores do mesmo.'
            >
                <CreateTeamPage
                    buttonText="Criar Equipa"
                    onCreateTeam={onCloseModal}
                />
            </WorkSyncModal>
        </div>
    )
}
