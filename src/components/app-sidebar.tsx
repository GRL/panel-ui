"use client"

import React from "react"
import {Activity, CircleDollarSign, ListIcon, NotebookText, SquareStack, User} from "lucide-react"
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
} from "@/components/ui/sidebar"
import {useAppDispatch, useAppSelector} from "@/hooks.ts";
import {App} from "@/models/app.ts"
import {setPage} from "@/models/appSlice.ts";
import {Badge} from "@/components/ui/badge.tsx";
import {useSelector} from "react-redux";
import {selectCashoutMethods} from "@/models/cashoutMethodSlice.ts";
import {selectTransactionHistory} from "@/models/transactionHistorySlice.ts";
import {selectQuestions} from "../models/questionSlice";
import {selectUserUpkAnswers} from "../models/userUpkAnswerSlice";

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
    const app: App = useAppSelector(state => state.app)
    const dispatch = useAppDispatch()
    const cashoutMethods = useSelector(selectCashoutMethods)
    const transactionHistory = useSelector(selectTransactionHistory)

    const questions = useSelector(selectQuestions)
    const upkAnswers = useSelector(selectUserUpkAnswers)
    const taskAttempts = useAppSelector(state => state.taskStatus)

    return (
        <Sidebar collapsible="none" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem key="panel_name">
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:!p-1.5"
                        >

                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
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

                            <SidebarMenuItem key="task_attempts"
                                             onClick={() => dispatch(setPage("task_attempts"))}
                            >
                                <SidebarMenuButton tooltip="Survey History">
                                    <Activity/>
                                    <span>
                                Survey History <Badge
                                        className="absolute top-2 right-2 h-5 min-w-5 rounded-full px-1 font-mono tabular-nums cursor-pointer"
                                        variant="outline"
                                    >{taskAttempts.length.toLocaleString()}</Badge>
                            </span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

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

                            <SidebarMenuItem
                                key="transaction_hisotry"
                                className="cursor-pointer"
                            >
                                <SidebarMenuButton asChild>
                                    <a
                                        onClick={() => dispatch(setPage("transaction_history"))}
                                    >
                                        <SquareStack/>
                                        <span>History <Badge
                                            className="absolute top-2 right-2 h-5 min-w-5 rounded-full px-1 font-mono tabular-nums cursor-pointer"
                                            variant="outline"
                                        >{transactionHistory.length.toLocaleString()}</Badge></span>
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
