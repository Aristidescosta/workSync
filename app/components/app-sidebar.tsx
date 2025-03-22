import { Calendar, ChevronDown, ChevronUp, Home, Inbox, MoreHorizontal, Search, Settings, User2 } from "lucide-react"

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
    SidebarMenuItem
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { useUserSessionStore } from "@/src/hooks"
import { Avatar, AvatarImage } from "./ui/avatar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"
import { ITEMS, PROJECTS } from "@/src/utils/constants"
import { useNavigate } from "react-router-dom"

export function AppSidebar() {

    const user = useUserSessionStore(state => state.user)
    const logout = useUserSessionStore(state => state.logout)
    const navigate = useNavigate()

    const onLogout = () => {
        logout()
            .then(() => navigate("/auth/sign-in"))
    }

    return (
        <Sidebar collapsible="offcanvas">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="text-3xl mb-8">WorSync</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {ITEMS.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    {
                                        item.title.includes("Projectos") ?
                                            (
                                                <Collapsible defaultOpen className="group/collapsible">
                                                    <SidebarGroup>
                                                        <SidebarGroupLabel className="text-lg text-black" asChild>
                                                            <CollapsibleTrigger>
                                                                Projectos
                                                                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                                                            </CollapsibleTrigger>
                                                        </SidebarGroupLabel>
                                                        <CollapsibleContent>
                                                            <SidebarGroupContent />
                                                            <SidebarMenu>
                                                                {PROJECTS.map((project) => (
                                                                    <SidebarMenuItem key={project.name}>
                                                                        <SidebarMenuButton asChild>
                                                                            <a href={project.url}>
                                                                                <span>{project.name}</span>
                                                                            </a>
                                                                        </SidebarMenuButton>
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
                                                                    </SidebarMenuItem>
                                                                ))}
                                                            </SidebarMenu>
                                                        </CollapsibleContent>
                                                    </SidebarGroup>
                                                </Collapsible>
                                            ) :
                                            <SidebarMenuButton asChild className="text-lg">
                                                <a href={item.url}>
                                                    {/* <item.icon style={{ width: 24, height:24 }}/> */}
                                                    <span>{item.title}</span>
                                                </a>
                                            </SidebarMenuButton>
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
                                    {
                                        user?.session.photoUrl ? (
                                            <Avatar>
                                                <AvatarImage src={user.session.photoUrl} alt={user.session.displayName} />
                                            </Avatar>
                                        )
                                            :
                                            (
                                                <User2 />
                                            )
                                    }
                                    {user?.session.displayName}
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
