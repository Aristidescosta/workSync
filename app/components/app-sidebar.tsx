import { ChevronUp, MoreHorizontal, User2 } from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { useUserSessionStore } from "@/src/hooks"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { ITEMS, PROJECTS } from "@/src/utils/constants"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select"
import { useTeamStore } from "@/src/hooks/useTeam"
import { useWorkspaceStore } from "@/src/hooks/useWorkspace"
import { WorkSyncIcon } from "@/react-icons"
import { useEffect, useState } from "react"
import { WorkspaceType } from "@/src/types/WorkspaceType"

export function AppSidebar() {
    const user = useUserSessionStore(state => state.user)
    const logout = useUserSessionStore(state => state.logout)
    const navigate = useNavigate()
    const { toggleSidebar, isMobile } = useSidebar()
    const location = useLocation() 

    const onLogout = () => {
        logout()
            .then(() => navigate("/auth/sign-in"))
    }

    const [workspaces, setWorkspaces] = useState<WorkspaceType[]>([]);
    const team = useTeamStore(state => state.team)
    const workspace = useWorkspaceStore(state => state.workspace)
    const observingAllWorkspaces = useWorkspaceStore(state => state.observingAllWorkspaces)

    function onNavigateTo(route: string) {
        if (team && workspace) {
            navigate(`/home/${team.teamId}/${encodeURI(workspace.workspaceName)}/${encodeURIComponent(route.toLowerCase())}`)
        }
        if (isMobile) toggleSidebar()
    }

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

    const isActive = (path: string) => {
        return location.pathname.includes(path);
    }

    return (
        <Sidebar >
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="text-3xl">WorSync</SidebarGroupLabel>
                    <Select>
                        <SelectTrigger className="w-full mb-8">
                            <SelectValue placeholder="Selecione o workspace" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Workspaces</SelectLabel>
                                {
                                    workspaces.map((ws) => (
                                        <SelectItem key={ws.workspaceId} value={ws.workspaceId}>{ws.workspaceName}</SelectItem>
                                    ))
                                }
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {ITEMS.map((item) => (
                                <SidebarMenuItem key={item.title} >
                                    <SidebarMenuButton
                                        isActive={isActive(item.url)} // Verifica se o item é ativo
                                        asChild
                                        className={`text-lg cursor-pointer ${isActive(item.url) ? 'bg-gray-200' : ''}`} // Adiciona um estilo ativo
                                    >
                                        <div onClick={() => onNavigateTo(item.url)}>
                                            <WorkSyncIcon
                                                package="githubocticonsicons"
                                                name={item.icon}
                                            />
                                            <span>{item.title}</span>
                                        </div>
                                    </SidebarMenuButton>
                                    {
                                        item.title.includes("Projectos") &&
                                        <SidebarMenuSub>
                                            {
                                                PROJECTS.map((project) => (
                                                    <SidebarMenuSubItem key={project.url}>
                                                        <SidebarMenuSubButton asChild>
                                                            <div onClick={() => onNavigateTo(item.url)}>
                                                                <span>{project.name}</span>
                                                            </div>
                                                        </SidebarMenuSubButton>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <SidebarMenuAction>
                                                                    <MoreHorizontal />
                                                                </SidebarMenuAction>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent side="right" align="start">
                                                                <DropdownMenuItem>
                                                                    <span>Editar o projecto</span>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem>
                                                                    <span>Eliminar o projecto</span>
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </SidebarMenuSubItem>
                                                ))
                                            }
                                        </SidebarMenuSub>
                                    }
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton>
                                    <Avatar>
                                        <AvatarImage src={user?.session.photoUrl ?? undefined} alt={user?.session.displayName} />
                                        <AvatarFallback>{user?.session.displayName.getInitials()}</AvatarFallback>
                                    </Avatar>
                                    <ChevronUp className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                className="w-[--radix-popper-anchor-width]"
                            >
                                <DropdownMenuItem onClick={onLogout}>
                                    <span>Terminar sessão</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
