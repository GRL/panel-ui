import {useAppDispatch, useAppSelector} from "@/hooks.ts";

const TransactionHistoryPage = () => {
    const dispatch = useAppDispatch()
    const transactionHistory = useAppSelector(state => state.transactionHistory)


    return (
        <>
            {
                transactionHistory.map(() => {
                })
            }
        </>
    )
}

export {
    TransactionHistoryPage
}