import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import React from "react"

export const BaseLayoutPage = ({ children }: { children?: React.ReactNode }) => {
    return (
        <SidebarProvider>
            <InnerLayout>{children}</InnerLayout>
        </SidebarProvider>
    )
}

const InnerLayout = ({ children }: { children: React.ReactNode }) => {
    const { isMobile } = useSidebar()

    return (
        <>
            <AppSidebar />
            <main>
                {isMobile && <SidebarTrigger />}
                {children}
            </main>
        </>
    )
}
