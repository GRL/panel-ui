import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import type {RootState} from '@/store'
import {CashoutMethodOut} from "@/api";


const initialState: CashoutMethodOut[] = []

const cashoutMethodSlice = createSlice({
    name: 'cashoutMethods',
    initialState,
    reducers: {
        setCashoutMethods(state, action: PayloadAction<CashoutMethodOut[]>) {
            return action.payload;
        },
        // redeemMethod: {
            //     let res = {'status': false, 'msg': ''};
            //     let cashout_method = this.collection.getCashoutMethod();
            //     let req_amt = +this.ui.amount.val();
            //
            //     // Generic checks
            //     if (!cashout_method) {
            //         res['msg'] = "Cashout method not selected";
            //         return res
            //     }
            //
            //     if (isNaN(req_amt)) {
            //         res['msg'] = "Invalid amount (numbers only)";
            //         return res;
            //     }
            //
            //     if (!this.WALLET) {
            //         res['msg'] = "Unknown wallet balance";
            //         return res
            //     }
            //
            //     let balance: number = this.WALLET.get("redeemable_amount");
            //
            //     // Limit checks
            //     if (balance < cashout_method.get("min_value")) {
            //         res["msg"] = "Wallet balance not large enough";
            //         return res;
            //     }
            //
            //     let req_amount = this.getIntCentsValue()
            //
            //     if (req_amount < cashout_method.get("min_value")) {
            //         res["msg"] = "Requested amount not large enough";
            //         return res;
            //     }
            //
            //     if (req_amount > cashout_method.get("max_value")) {
            //         res["msg"] = "Amount too large for payout method";
            //         return res;
            //     }
            //
            //     if (req_amount > balance) {
            //         res["msg"] = "Amount is more than wallet balance";
            //         return res;
            //     }
            //
            //     res["status"] = true;
            //     return res;
            // },
        // }
    }
})

export const {
    setCashoutMethods,
} = cashoutMethodSlice.actions;
export default cashoutMethodSlice.reducer

export const selectCashoutMethods = (state: RootState) => state.cashoutMethods

export const selectFixedCashoutMethods = (state: RootState) =>
    // @ts-ignore
    state.cashoutMethods.filter(cm => cm.data.value_type === "fixed")
export const selectVariableCashoutMethods = (state: RootState) =>
    // @ts-ignore
    state.cashoutMethods.filter(cm => cm.data.value_type === "variable")