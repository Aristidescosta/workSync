import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AppSidebar } from "@/components/app-sidebar"
import { useUserSessionStore } from "../hooks"
import { useLocation, useNavigate } from "react-router-dom"
import React from "react"
import { Label } from "@/components/ui/label"

export const BaseLayoutPage = ({ children }: { children: React.ReactNode }) => {
    return (
        <SidebarProvider>
            <InnerLayout>{children}</InnerLayout>
        </SidebarProvider>
    )
}

const InnerLayout = ({ children }: { children: React.ReactNode }) => {
    const { isMobile } = useSidebar()
    const location = useLocation()
    const user = useUserSessionStore(state => state.user)
    const navigate = useNavigate()
    const logout = useUserSessionStore(state => state.logout)

    const onLogout = () => {
        logout()
            .then(() => navigate("/auth"))
    }

    const onChangeTeam = () => {
        navigate("/home")
    }

    return (
        <>
            {
                location.pathname !== "/home" &&
                <AppSidebar />
            }
            <main className="w-full">
                {
                    location.pathname === "/home" ? (
                        <nav className="flex items-center justify-between w-ful px-2">
                            {
                                location.pathname === "/home" ?
                                    <Label className="text-xl text-secondary">WorkSync</Label>
                                    :
                                    <SidebarTrigger />
                            }
                            <ul>
                                <li>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Avatar>
                                                <AvatarImage src={user?.session.photoUrl ?? undefined} alt={user?.session.displayName} />
                                                <AvatarFallback>{user?.session.displayName.getInitials()}</AvatarFallback>
                                            </Avatar>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-56">
                                            <DropdownMenuItem onClick={onChangeTeam}>
                                                Trocar de equipa
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={onLogout}>
                                                Terminar sessão
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </li>
                            </ul>
                        </nav>
                    )
                        :
                        isMobile && (
                            <nav className="flex items-center justify-between w-ful px-2">
                                {
                                    location.pathname === "/home" ?
                                        <Label className="text-xl text-secondary">WorkSync</Label>
                                        :
                                        <SidebarTrigger />
                                }
                                <ul>
                                    <li>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Avatar>
                                                    <AvatarImage src={user?.session.photoUrl ?? undefined} alt={user?.session.displayName} />
                                                    <AvatarFallback>{user?.session.displayName.getInitials()}</AvatarFallback>
                                                </Avatar>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="w-56">
                                                <DropdownMenuItem onClick={onChangeTeam}>
                                                    Trocar de equipa
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={onLogout}>
                                                    Terminar sessão
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </li>
                                </ul>
                            </nav>
                        )
                }
                <div className="p-4 w-full h-full">
                    {children}
                </div>
            </main>
        </>
    )
}
