import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {MarketProfileKnowledge} from "@/api";
import type {RootState} from '@/store'

const initialState: MarketProfileKnowledge[] = []


const userMarketplaceAnswerSlice = createSlice({
    name: 'userMarketplaceAnswers',
    initialState,
    reducers: {
        setMarketplaceAnswers(state, action: PayloadAction<MarketProfileKnowledge[]>) {
            // TODO: Does this need question_id + source uniqueness?
            const existingIds = new Set(state.map(q => q.question_id));
            const newQuestions = action.payload.filter(q => !existingIds.has(q.question_id));
            state.push(...newQuestions);
        }
    }
})

export const {
    setMarketplaceAnswers,
} = userMarketplaceAnswerSlice.actions;

export default userMarketplaceAnswerSlice.reducer;

export const selectUserMarketplaceAnswers = (state: RootState) => state.userMarketplaceAnswers