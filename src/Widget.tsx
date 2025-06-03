import React, {useEffect} from 'react'
import {AppSidebar} from "@/components/app-sidebar"
import {SiteHeader} from "@/components/site-header"
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar"
import {Offerwall} from "@/pages/Offerwall.tsx"
import {QuestionsPage} from "@/pages/Questions.tsx";

import {useAppDispatch, useAppSelector} from "@/hooks.ts";
import {OfferwallApi, ProfilingQuestionsApi} from "@/api";
import {setBuckets} from "@/models/bucketSlice.ts";
import {setQuestions} from "@/models/questionSlice.ts"
import {CashoutMethodsPage} from "@/pages/CashoutMethods.tsx";

import './index.css';


const Widget = () => {

    const dispatch = useAppDispatch()
    const app = useAppSelector(state => state.app)

    useEffect(() => {
        // https://fsb.generalresearch.com/{product_id}/offerwall/37d1da64/?country
        new OfferwallApi().offerwallSoftpairProductIdOfferwall37d1da64Get(app.bpid, app.bpuid, "104.9.125.144")
            .then(res => {
                dispatch(setBuckets(res.data.offerwall.buckets))
            })
            .catch(err => console.log(err));

        new ProfilingQuestionsApi().getProfilingQuestionsProductIdProfilingQuestionsGet(app.bpid, app.bpuid, "104.9.125.144")
            .then(res => {
                dispatch(setQuestions(res.data.questions))
            })
            .catch(err => console.log(err));
    }, []); // ← empty array means "run once"


    return (
        <SidebarProvider>
            <AppSidebar variant="floating" />
            <SidebarInset>
                <SiteHeader/>

                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                            <div className="px-4 lg:px-6">
                                {app.currentPage === 'offerwall' && <Offerwall />}
                                {app.currentPage === 'questions' && <QuestionsPage />}
                                {app.currentPage === 'cashouts' && <CashoutMethodsPage />}
                            </div>
                        </div>
                    </div>
                </div>

            </SidebarInset>
        </SidebarProvider>
    )
}

export {Widget}
