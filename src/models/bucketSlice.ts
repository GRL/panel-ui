import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {SoftPairBucketClass} from "@/models/bucket.ts"
// import {ProfilingQuestion} from "@/models/question.ts";
import type {RootState} from '@/store'
import {SoftPairBucket} from "@/api/models/soft-pair-bucket.ts"

// Create an initial state value for the reducer, with that type
const initialState: SoftPairBucket[] = []

// Create the slice and pass in the initial state
const bucketSlice = createSlice({
    name: 'buckets',
    initialState,
    reducers: {
        setBuckets(state, action: PayloadAction<SoftPairBucket[]>) {
            return action.payload;
        },
        bucketAdded(state, action: PayloadAction<SoftPairBucket>) {
            state.push(action.payload);
        }
    }
})

// Export the generated reducer function
export const {setBuckets, bucketAdded} = bucketSlice.actions;
export default bucketSlice.reducer

export const selectBucketsStatus = (state: RootState) => state.buckets.status
export const selectBucketsError = (state: RootState) => state.buckets.error

export const selectAllBuckets = (state: RootState) => state.buckets

export const selectBucketById = (state: RootState, bucketId: string | null) =>
    state.buckets.find(bucket => bucket.id === bucketId)