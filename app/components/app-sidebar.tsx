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
import { Link, useNavigate } from "react-router-dom"

export function AppSidebar() {

    const user = useUserSessionStore(state => state.user)
    const logout = useUserSessionStore(state => state.logout)
    const navigate = useNavigate()
    const { toggleSidebar } = useSidebar()

    const onLogout = () => {
        logout()
            .then(() => navigate("/auth/sign-in"))
    }

    const onNavigateTo = (path: string) => {
        toggleSidebar()
        navigate(path)
    }

    return (
        <Sidebar >
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="text-3xl mb-8">WorSync</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {ITEMS.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild className="text-lg">
                                        <div onClick={() => onNavigateTo(item.url)}>
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
