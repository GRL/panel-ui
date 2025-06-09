import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {MarketProfileKnowledge} from "@/api";

const marketplaceInitialState: MarketProfileKnowledge[] = []


const marketplaceAnswerSlice = createSlice({
    name: 'marketplaceAnswers',
    marketplaceInitialState,
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
} = marketplaceAnswerSlice.actions;

export default marketplaceAnswerSlice.reducer;
