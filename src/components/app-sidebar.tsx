"use client"

import * as React from "react"
import {CircleDollarSign, MessageCircle, SquareStack} from "lucide-react"

import {NavMain} from "@/components/nav-main"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import {useAppSelector} from "@/hooks.ts";

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
    const app = useAppSelector(state => state.app)

    const {isMobile} = useSidebar()

    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem key="panel_name">
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:!p-1.5"
                        >
                            <span className="text-base font-semibold">{app.panelName}</span>

                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain></NavMain>
            </SidebarContent>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Redemption</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>

                            <SidebarMenuItem key="cashout_methods">
                                <SidebarMenuButton asChild>
                                    <a href="#">
                                        <CircleDollarSign/>
                                        <span>Methods</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            <SidebarMenuItem key="cashout_history">
                                <SidebarMenuButton asChild>
                                    <a href="#">
                                        <SquareStack/>
                                        <span>History</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

        </Sidebar>
    )
}
