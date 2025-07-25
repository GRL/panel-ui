import { useEffect, useState, useRef } from "react"

import {SiteHeader} from "@/components/site-header"
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar"
import {Offerwall} from "@/pages/Offerwall.tsx"
import {QuestionsPage} from "@/pages/Questions.tsx";
import {Demographics} from "@/pages/Demographics.tsx"
import {CashoutMethodsPage} from "@/pages/CashoutMethods.tsx";
import {TransactionHistoryPage} from "@/pages/TransactionHistory.tsx"
import {TaskAttemptHistoryPage} from "@/pages/TaskAttemptHistory.tsx";
import {AppSidebar} from "@/components/app-sidebar"

import {useAppDispatch, useAppSelector} from "@/hooks.ts";
import {
    CashoutMethodOut,
    MarketProfileKnowledge,
    OfferwallApi,
    ProductUserApi,
    ProfilingQuestionsApi,
    QuestionInfo,
    StatusApi,
    UserProfileKnowledge,
    UserWalletBalance,
    WalletApi
} from "@/api";
import {ProfileQuestion, setQuestions} from "@/models/questionSlice.ts";
import {setBuckets} from "@/models/bucketSlice.ts";
import {setCashoutMethods} from "@/models/cashoutMethodSlice.ts";
import {setWallet} from "@/models/walletSlice.ts"
import {setUpkQuestions} from "@/models/upkQuestionSlice.ts"
import {setAvailabilityCount, setOfferwallId} from "@/models/appSlice.ts"
import {setUpkAnswers} from "@/models/userUpkAnswerSlice.ts";
import {setMarketplaceAnswers} from "@/models/userMarketplaceAnswerSlice.ts";
import {setUserProfile} from "@/models/userProfileSlice.ts";
import {setTaskStatuses} from "@/models/taskStatusSlice.ts"
import {App} from "@/models/app.ts"
import {ScrollArea} from "@/components/ui/scroll-area"

import './index.css';

export function useParentHeight() {
    const ref = useRef<HTMLDivElement>(null)
    const [height, setHeight] = useState<number | null>(null)

    useEffect(() => {
        if (!ref.current) return

        const observer = new ResizeObserver(() => {
            if (ref.current?.parentElement) {
                const h = ref.current.parentElement.getBoundingClientRect().height
                setHeight(h)
            }
        })

        observer.observe(ref.current.parentElement!)

        return () => observer.disconnect()
    }, [])

    return { ref, height }
}

const Widget = () => {
    const { ref, height } = useParentHeight()

    const dispatch = useAppDispatch()
    const app: App = useAppSelector(state => state.app)

    useEffect(() => {
        // https://fsb.generalresearch.com/{product_id}/offerwall/37d1da64/?country
        new OfferwallApi().offerwallSoftpairProductIdOfferwall37d1da64Get(app.bpid, app.bpuid, "104.9.125.144")
            .then(res => {
                // We want to set these questions first, because the Bucket Component views may do
                // some redux lookups
                const objects: ProfileQuestion[] = Object.values(res.data.offerwall.question_info) as ProfileQuestion[]
                dispatch(setQuestions(objects))

                dispatch(setAvailabilityCount(res.data.offerwall.availability_count))
                dispatch(setOfferwallId(res.data.offerwall.id))
                dispatch(setBuckets(res.data.offerwall.buckets))
            })
            .catch(err => console.log(err));

        new StatusApi().listTaskStatusesProductIdStatusGet(app.bpid, app.bpuid)
            .then(res => {
                dispatch(setTaskStatuses(res.data.tasks_status))
            })
            .catch(err => console.log(err))

        new ProductUserApi().userProfileProductIdUserProductUserIdProfileGet(app.bpid, app.bpuid)
            .then(res => {
                dispatch(setUserProfile(res.data["user-profile"]))
            })
            .catch(err => console.log(err))

        new ProfilingQuestionsApi().getProfilingQuestionsProductIdProfilingQuestionsGet(app.bpid, app.bpuid, "104.9.125.144", undefined, undefined, 2500)
            .then(res => {
                dispatch(setQuestions(res.data.questions as ProfileQuestion[]))
            })
            .catch(err => console.log(err));

        new ProfilingQuestionsApi().userProfileProductIdUserProfileGet(app.bpid, app.bpuid, "us")
            .then(res => {
                dispatch(setMarketplaceAnswers(res.data["user-profile"].marketplace_profile_knowledge as MarketProfileKnowledge[]))
                dispatch(setUpkAnswers(res.data["user-profile"].user_profile_knowledge as UserProfileKnowledge[]))
            }).catch(err => console.log(err))

        new ProfilingQuestionsApi().profilingInfoProductIdProfilingInfoGet(app.bpid, "us")
            .then(res => {
                dispatch(setUpkQuestions(res.data["profiling-info"] as QuestionInfo[]))
            })
            .catch(err => console.log(err))

        new WalletApi().getCashoutMethodsProductIdCashoutMethodsGet(app.bpid, app.bpuid)
            .then(res => {
                dispatch(setCashoutMethods(res.data.cashout_methods as CashoutMethodOut[]))
            })
            .catch(err => console.log(err))

        new WalletApi().getUserWalletBalanceProductIdWalletGet(app.bpid, app.bpuid)
            .then(res => {
                dispatch(setWallet(res.data.wallet as UserWalletBalance))
            })
            .catch(() => {
                // TODO: Wallet mode is likely off
            })

    }, []); // ← empty array means "run once"

    return (
        <div ref={ref} className="w-full h-full bg-white rounded-lg shadow relative">
            <SidebarProvider className="bg-blend-darken h-full flex flex-1" style={{ height }}>
                <AppSidebar className="h-full" style={{ height }}/>

                <SidebarInset className="h-full" style={{ height }}>
                    <SiteHeader/>
                    <ScrollArea className="overflow-auto px-4" style={{ maxHeight: height ? height - 24 : undefined }}>
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                            <div className="px-4 lg:px-6 bg-white">
                                {app.currentPage === 'offerwall' && <Offerwall/>}
                                {app.currentPage === 'questions' && <QuestionsPage/>}
                                {app.currentPage === 'cashout_methods' && <CashoutMethodsPage/>}
                                {app.currentPage === 'task_attempts' && <TaskAttemptHistoryPage/>}
                                {app.currentPage === 'demographics' && <Demographics/>}
                                {app.currentPage === 'transaction_history' && <TransactionHistoryPage/>}
                            </div>
                        </div>
                    </ScrollArea>

                </SidebarInset>
            </SidebarProvider>
        </div>
    )
}

export {Widget}
