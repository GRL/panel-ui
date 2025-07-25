import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import type {RootState} from '@/store'
import {SoftPairBucket} from "@/api";


const initialState: SoftPairBucket[] = []

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

export const {setBuckets, bucketAdded} = bucketSlice.actions;
export default bucketSlice.reducer

export const selectBucketById = (state: RootState, bucketId: string | null) =>
    state.buckets.find(bucket => bucket.id === bucketId)