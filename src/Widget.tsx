import React, {useEffect} from 'react'
import {AppSidebar} from "@/components/app-sidebar"
import {SiteHeader} from "@/components/site-header"
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar"
import {Offerwall} from "@/pages/Offerwall.tsx"
import {QuestionsPage} from "@/pages/Questions.tsx";

import {useAppDispatch, useAppSelector} from "@/hooks.ts";
import {CashoutMethodOut, OfferwallApi, ProfilingQuestionsApi, QuestionInfo, UserWalletBalance, WalletApi} from "@/api";
import {ProfileQuestion, setQuestions} from "@/models/questionSlice.ts";
import {setBuckets} from "@/models/bucketSlice.ts";
import {setCashoutMethods} from "@/models/cashoutMethodSlice.ts";
import {setWallet} from "@/models/walletSlice.ts"
import {CashoutMethodsPage} from "@/pages/CashoutMethods.tsx";
import {setUpkQuestions} from "@/models/upkQuestionSlice.ts"
import {setAvailabilityCount, setOfferwallId} from "@/models/appSlice.ts"

import './index.css';


const Widget = () => {

    const dispatch = useAppDispatch()
    const app = useAppSelector(state => state.app)

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

        new ProfilingQuestionsApi().getProfilingQuestionsProductIdProfilingQuestionsGet(app.bpid, app.bpuid, "104.9.125.144", undefined, undefined, 2500)
            .then(res => {
                dispatch(setQuestions(res.data.questions as ProfileQuestion[]))
            })
            .catch(err => console.log(err));

        new ProfilingQuestionsApi().userProfileProductIdUserProfileGet(app.bpid, app.bpuid, "us")
            .then(res => {
                console.log("Marketplace Profile", res.data["user-profile"].marketplace_profile_knowledge)
                console.log("UPK Profile", res.data["user-profile"].user_profile_knowledge)
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
            .catch(err => {
                // TODO: Wallet mode is likely off
            })

    }, []); // ← empty array means "run once"


    return (
        <SidebarProvider>
            <AppSidebar variant="floating"/>
            <SidebarInset>
                <SiteHeader/>

                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                            <div className="px-4 lg:px-6">
                                {app.currentPage === 'offerwall' && <Offerwall/>}
                                {app.currentPage === 'questions' && <QuestionsPage/>}
                                {app.currentPage === 'cashout_methods' && <CashoutMethodsPage/>}
                            </div>
                        </div>
                    </div>
                </div>

            </SidebarInset>
        </SidebarProvider>
    )
}

export {Widget}
