"use client"

import {ListIcon, NotebookText, Users, User} from "lucide-react"
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import {setPage} from "@/models/appSlice.ts";
import {useAppDispatch, useAppSelector} from "@/hooks.ts";
import {useSelector} from "react-redux";
import {selectQuestions} from "@/models/questionSlice.ts";
import {Badge} from "@/components/ui/badge"
import {selectUserUpkAnswers} from "@/models/userUpkAnswerSlice.ts";

export function NavMain() {
    const dispatch = useAppDispatch()

    const app = useAppSelector(state => state.app)
    const questions = useSelector(selectQuestions)
    const upkAnswers = useSelector(selectUserUpkAnswers)

    return (
        <SidebarGroup>
            <SidebarGroupContent className="flex flex-col gap-2">
                <SidebarMenu>

                    <SidebarMenuItem key="surveys"
                                     onClick={() => dispatch(setPage("offerwall"))}
                    >
                        <SidebarMenuButton tooltip="Surveys">
                            <NotebookText/>
                            <span>
                                Surveys <Badge
                                className="absolute top-2 right-2 h-5 min-w-5 rounded-full px-1 font-mono tabular-nums cursor-pointer"
                                variant="outline"
                                title={`${(app.availability_count ?? 0).toLocaleString()} live surveys`}
                            >{(app.availability_count ?? 0).toLocaleString()}</Badge>
                            </span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>


                    <SidebarMenuItem key="questions"
                                     onClick={() => dispatch(setPage("questions"))}
                    >
                        <SidebarMenuButton tooltip="Questions">
                            <ListIcon/>
                            <span>
                                Questions <Badge
                                className="absolute top-2 right-2 h-5 min-w-5 rounded-full px-1 font-mono tabular-nums cursor-pointer"
                                variant="outline"
                                title={`${questions.length.toLocaleString()} profiling question available`}
                            >{questions.length.toLocaleString()}</Badge>
                            </span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem key="demographics"
                                     onClick={() => dispatch(setPage("demographics"))}
                    >
                        <SidebarMenuButton tooltip="User Demographics">
                            <User/>
                            <span>
                                Demographics <Badge
                                className="absolute top-2 right-2 h-5 min-w-5 rounded-full px-1 font-mono tabular-nums cursor-pointer"
                                variant="outline"
                            >{upkAnswers.length.toLocaleString()}</Badge>
                            </span>
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
