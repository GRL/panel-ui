import {render, screen,} from '@testing-library/react';
import {describe, it} from '@jest/globals';
import {ProfileQuestionFull} from "@/pages/Questions"
import '@testing-library/jest-dom'; // needed for .toBeInTheDocument()
import {ProfileQuestion} from "@/models/questionSlice";
import {Provider} from "react-redux";
import {store} from "@/store";
import {App} from "@/models/app";
import {setApp} from "@/models/appSlice.ts";
import '@testing-library/jest-dom';

const q: ProfileQuestion = {
    "question_id": "0471eb56de8247cda7468e473bab87f2",
    "ext_question_id": "rd:105019",
    "question_type": "MC",
    "country_iso": "us",
    "language_iso": "eng",
    "question_text": "Which of the following is your primary bank? ",
    "choices": [
        {
            "choice_id": "1",
            "choice_text": "Ally Bank",
            "order": 0,
            "exclusive": false
        },
        {
            "choice_id": "2",
            "choice_text": "Bank of America",
            "order": 1,
            "exclusive": false
        },
        {
            "choice_id": "27",
            "choice_text": "BB&T",
            "order": 2,
            "exclusive": false
        },
    ],
    "selector": "SA",
    "importance": {
        "task_count": 3,
        "task_score": 0.006180190564957855,
        "marketplace_task_count": {
            "rd": 3
        }
    },
    "categories": [],
    "task_count": 3,
    "task_score": 0.006180190564957855,
    "marketplace_task_count": {
        "rd": 3
    },
    "active": true
} as ProfileQuestion

// GRL Snippet configuration options
// const settings: App = {
//     targetId: 'grl-widget',
//     bpid: "invalid-bpid-from-snippet",
//     bpuid: "invalid-bpuid-from-snippet",
//     offerwall: "37d1da64",
//     walletMode: true,
//     panelName: null,
//     leaderboard: false,
//     currentPage: "offerwall"
// } as App
// store.dispatch(setApp(settings))

describe('ProfileQuestionFull', () => {

    it('renders the correct title', () => {
        render(
            <Provider store={store}>
                <ProfileQuestionFull question={q} submitAnswerEvt={() => {}}/>
            </Provider>
        );
        const element = screen.getByText(/Which of the following is your primary bank/i);
        expect(element).toBeInTheDocument();
    });
});