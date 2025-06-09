import {useAppDispatch, useAppSelector} from "@/hooks.ts";
import {Pagination, PaginationContent, PaginationItem, PaginationNext} from "@/components/ui/pagination.tsx";
import React from "react";
import {ProfileQuestionFull} from "@/pages/Questions.tsx";

const TransactionHistoryPage = () => {
    const dispatch = useAppDispatch()
    const transactionHistory = useAppSelector(state => state.transactionHistory)


    return (
        <>
            {
                transactionHistory.map(th => {

                })
            }
        </>
    )
}

export {
    TransactionHistoryPage
}