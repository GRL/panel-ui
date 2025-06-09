"use client"

import * as React from "react"
import {CircleDollarSign, SquareStack} from "lucide-react"

import {NavMain} from "@/components/nav-main"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import {useAppDispatch, useAppSelector} from "@/hooks.ts";
import {setPage} from "@/models/appSlice.ts";
import {Badge} from "@/components/ui/badge.tsx";
import {useSelector} from "react-redux";
import {selectCashoutMethods} from "@/models/cashoutMethodSlice.ts";

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
    const app = useAppSelector(state => state.app)
    const dispatch = useAppDispatch()
    const cashoutMethods = useSelector(selectCashoutMethods)

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

                            <SidebarMenuItem
                                key="cashout_methods"
                                className="cursor-pointer"
                            >
                                <SidebarMenuButton asChild>
                                    <a
                                        onClick={() => dispatch(setPage("cashout_methods"))}
                                    >
                                        <CircleDollarSign/>
                                        <span>
                                Methods <Badge
                                            className="absolute top-2 right-2 h-5 min-w-5 rounded-full px-1 font-mono tabular-nums cursor-pointer"
                                            variant="outline"
                                            title={`${cashoutMethods.length.toLocaleString()} cashout methods available`}
                                        >{cashoutMethods.length.toLocaleString()}</Badge>
                            </span> </a>


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
