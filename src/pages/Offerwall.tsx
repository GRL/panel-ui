import React from 'react'
import {Separator} from "@/components/ui/separator"
import {Link} from '@mui/material';
import {useSelector} from "react-redux";

import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import {makeSelectQuestionsByIds, setNextQuestion, setQuestions} from "@/models/questionSlice.ts"
import {CheckIcon, MessageCircleQuestionIcon, XIcon} from "lucide-react"
import {
    BodyOfferwallSoftpairPostProductIdOfferwall37d1da64OfferwallIdPost,
    OfferwallApi,
    SoftPairBucket,
    UserQuestionAnswerIn
} from "@/api"
import {useAppDispatch, useAppSelector} from '@/hooks'
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger,} from "@/components/ui/sheet"
import {ProfileQuestionFull} from "@/pages/Questions.tsx"
import {Answer, saveAnswer, selectAnswerForQuestion, submitAnswer} from "@/models/answerSlice.ts";
import {assert} from "@/lib/utils.ts";
import {setAvailabilityCount, setOfferwallId} from "@/models/appSlice.ts";
import {setBuckets} from "@/models/bucketSlice.ts";

const BucketStatus: React.FC<SoftPairBucket> = ({bucket}) => {
    switch (bucket.eligibility) {
        case "eligible":
            return <CheckIcon/>;
        case "conditional":
            return <MessageCircleQuestionIcon/>;
        case "ineligible":
            return <XIcon/>;
    }
}

const ConditionalQuestions: React.FC<SoftPairBucket> = ({bucket}) => {
    const dispatch = useAppDispatch()

    const questions = useSelector(makeSelectQuestionsByIds(bucket.missing_questions))
    const question = questions[0]
    const answer: Answer | undefined = useSelector(selectAnswerForQuestion(question));
    const app = useAppSelector(state => state.app)

    console.log("Conditional bucket:", questions, question, answer)

    const submitEvt = () => {
        dispatch(submitAnswer({question: question}))

        assert(!answer?.complete, "Can't submit completed Answer")
        assert(!answer?.processing, "Can't submit processing Answer")
        assert(answer?.error_msg.length == 0, "Can't submit Answer with error message")

        let body: BodyOfferwallSoftpairPostProductIdOfferwall37d1da64OfferwallIdPost = {
            'answers': [{
                "question_id": question.question_id,
                "answer": answer.values
            } as UserQuestionAnswerIn
            ]
        }

        new OfferwallApi().offerwallSoftpairPostProductIdOfferwall37d1da64OfferwallIdPost(app.bpid, app.offerwall_id, app.bpuid, body)
            .then(res => {
                if (res.status == 200) {
                    dispatch(setAvailabilityCount(res.data.offerwall.availability_count))
                    dispatch(setOfferwallId(res.data.offerwall.id))
                    dispatch(setBuckets(res.data.offerwall.buckets))
                } else {
                    // let error_msg = res.data.msg
                }
            })
            .catch(err => console.log(err));
    }

    return (
        <Sheet>
            <SheetTrigger>Open</SheetTrigger>
            <SheetContent
                side="right"
                className="md:w-[900px], lg:w-[1000px]">

                <SheetHeader>
                    <SheetTitle>Bucket Questions</SheetTitle>
                    <SheetDescription>
                        This survey has some unanswered questions. Answer these to determine if you're
                        eligible for the Survey Bucket
                    </SheetDescription>
                </SheetHeader>

                {
                    questions.map(q => {
                        return <ProfileQuestionFull
                            key={q.question_id}
                            question={q}
                            submitAnswerEvt={submitEvt}
                            className="mt-4 m-2"/>
                    })
                }

            </SheetContent>
        </Sheet>
    )
}

const CallToAction: React.FC<SoftPairBucket> = ({bucket}) => {
    switch (bucket.eligibility) {
        case "eligible":
            return <Link href={bucket.uri}>
                <button type="button">
                    Start Survey
                </button>
            </Link>;
        case "conditional":
            return <ConditionalQuestions bucket={bucket}/>

        case "ineligible":
            return <button type="button">
                Ineligible Survey
            </button>;
    }
}

const Offerwall = () => {
    const buckets = useAppSelector(state => state.buckets)

    return (

        <div className="grid grid-cols-2 gap-2 p-2">

            {buckets.map((bucket) => (
                <Card key={`${bucket.id}`}>
                    <CardHeader>
                        <BucketStatus bucket={bucket}/>
                        <CardTitle>Card 1</CardTitle>
                    </CardHeader>

                    <CardContent className="flex items-center gap-2">
                        {/*<StarIcon className="w-5 h-5 fill-[#FFD700]"/>*/}
                        {/*<span className="text-sm">4.5</span>*/}
                        <CallToAction bucket={bucket}/>
                    </CardContent>

                    <CardFooter>
                        {/*<PieChart width={100} height=60}>*/}
                        {/*    <Pie*/}
                        {/*        dataKey="p"*/}
                        {/*        startAngle={180}*/}
                        {/*        endAngle={0}*/}
                        {/*        data={bucket.category}*/}
                        {/*        cx="50%"*/}
                        {/*        cy="50%"*/}
                        {/*        // onMouseEnter={this.onPieEnter}*/}
                        {/*        // outerRadius={80}*/}
                        {/*        // label*/}
                        {/*    />*/}
                        {/*</PieChart>*/}

                        <ScrollArea className="w-48 rounded-md border">
                            <div className="p-4">
                                <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
                                {bucket.contents.map((survey) => (
                                    <>
                                        <div key={`${bucket.id}-${survey.id}`} className="text-sm">
                                            {survey.id_code} - {survey.loi} seconds - {survey.payout} cents
                                        </div>
                                        <Separator className="my-2"/>
                                    </>
                                ))}
                            </div>
                        </ScrollArea>

                    </CardFooter>

                </Card>
            ))}

        </div>

    )
}

export {Offerwall}