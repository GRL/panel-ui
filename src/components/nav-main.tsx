"use client"

import {ListIcon, NotebookText, Users} from "lucide-react"
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import {setPage} from "@/models/appSlice.ts";
import {useAppDispatch} from "@/hooks.ts";

export function NavMain() {
    const dispatch = useAppDispatch()

    return (
        <SidebarGroup>
            <SidebarGroupContent className="flex flex-col gap-2">
                <SidebarMenu>

                    <SidebarMenuItem key="surveys"
                                     onClick={() => dispatch(setPage("offerwall"))}
                    >
                        <SidebarMenuButton tooltip="Surveys">
                            <NotebookText/>
                            <span>Surveys</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>


                    <SidebarMenuItem key="questions"
                                     onClick={() => dispatch(setPage("questions"))}
                    >
                        <SidebarMenuButton tooltip="Questions">
                            <ListIcon/>
                            <span>Questions</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem key="community">
                        <SidebarMenuButton tooltip="Community">
                            <Users/>
                            <span>Community</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
