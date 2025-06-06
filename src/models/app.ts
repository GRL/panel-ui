export type Page = 'offerwall' | 'questions' | 'cashouts';

export interface App {
    targetId: string,
    bpid: string;
    bpuid: string;
    offerwall: string;
    walletMode: boolean;
    panelName: string | null;
    leaderboard: boolean;

    currentPage: Page

    //-- responses saved from the last OfferwallResponse
    availability_count: number | undefined;
    offerwall_id: string | undefined;
}
