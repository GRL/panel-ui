import {SoftPairBucket} from "@/api/models/soft-pair-bucket.ts"

export class SoftPairBucketClass implements SoftPairBucket {
    readonly id: string;
    readonly uri: string;
    readonly category: any | null;
    readonly contents: any;
    readonly eligibility: any;
    readonly missingQuestions: any | null;
    readonly loi: any;
    readonly payout: any;

    constructor(data: {
        id: string,
        uri: string,
        category: any | null,
        contents: any,
        eligibility: any,
        missingQuestions: any | null,
        loi: any,
        payout: any
    }) {
        this.id = data.id;
        this.uri = data.uri;
        this.category = data.category;
        this.contents = data.contents;
        this.eligibility = data.eligibility;
        this.missingQuestions = data.missingQuestions;
        this.loi = data.loi;
        this.payout = data.payout;
    }
}