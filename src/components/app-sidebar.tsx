"use client"

import * as React from "react"
import {CircleDollarSign, MessageCircle, MoreVerticalIcon, SquareStack, UserCircleIcon} from "lucide-react"

import {NavMain} from "@/components/nav-main"
import {Avatar, AvatarFallback, AvatarImage,} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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

    // <button onClick={() => setActiveView('offerwall')}>Offerwall</button>
    // <button onClick={() => setActiveView('questions')}>Questions</button>
    // <button onClick={() => setActiveView('cashout')}>Cashout Methods</button>

    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
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

            <SidebarGroupContent>
                <SidebarMenu>
                    <SidebarMenuItem key="support">
                        <SidebarMenuButton asChild>
                            <a href="#">
                                <MessageCircle/>
                                <span>Support</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroupContent>


            <SidebarFooter>
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg grayscale">
                                <AvatarImage src="#" alt="foo"/>
                                <AvatarFallback className="rounded-lg">IW</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">Ironwood User</span>
                                <span className="truncate text-xs text-muted-foreground">
                                        ironwood@example.com
                </span>
                            </div>
                            <MoreVerticalIcon className="ml-auto size-4"/>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage src="#" alt="Ironwood User"/>
                                    <AvatarFallback className="rounded-lg">IW</AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">Ironwood User</span>
                                    <span className="truncate text-xs text-muted-foreground">
                                            ironwood@example.com
                  </span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <UserCircleIcon/>
                                Account
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator/>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarFooter>

        </Sidebar>
    )
}
