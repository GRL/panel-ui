import type {Action, ThunkAction} from '@reduxjs/toolkit'
import {configureStore} from '@reduxjs/toolkit'
import bucketReducers from "@/models/bucketSlice.ts"
import questionReducers from "@/models/questionSlice.ts"
import appReducers from "@/models/appSlice.ts"
import answerReducers from "@/models/answerSlice.ts"

export const store = configureStore({
    reducer: {
        app: appReducers,

        // - Read Only
        // -- These act as API cache stores to allow background loading
        buckets: bucketReducers,
        questions: questionReducers,

        // - Read Write
        // -- This stores user engagement (eg: answering any questions)
        answers: answerReducers
    }
})

// Infer the type of `store`
export type AppStore = typeof store
// Infer the `AppDispatch` type from the store itself
export type AppDispatch = typeof store.dispatch
// Same for the `RootState` type
export type RootState = ReturnType<typeof store.getState>

// Define a reusable type describing thunk functions
export type AppThunk<ThunkReturnType = void> = ThunkAction<
    ThunkReturnType,
    RootState,
    unknown,
    Action
>