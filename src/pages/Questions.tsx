import React from 'react'
import {
    BodySubmitProfilingQuestionsProductIdProfilingQuestionsPost,
    ProfilingQuestionsApiFactory,
    UpkQuestionChoice,
    UserQuestionAnswerIn
} from "@/api";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {useAppDispatch, useAppSelector} from "@/hooks.ts";
import {addAnswer, Answer, saveAnswer, selectAnswerForQuestion, submitAnswer} from "@/models/answerSlice.ts";
import {useSelector} from "react-redux";
import {Button} from "@/components/ui/button"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
} from "@/components/ui/pagination"
import {Input} from "@/components/ui/input"
import {Badge} from "@/components/ui/badge"
import clsx from "clsx"
import {
    ProfileQuestion,
    selectFirstAvailableQuestion,
    selectNextAvailableQuestion,
    selectQuestions,
    setNextQuestion,
    setQuestionActive
} from "@/models/questionSlice.ts";
import {assert} from "@/lib/utils.ts";
import {motion} from "framer-motion"

const TextEntry: React.FC<{ question: ProfileQuestion }> = ({question}) => {
    const dispatch = useAppDispatch()
    // const selectAnswer = useMemo(() => selectAnswerForQuestion(question), [question]);
    // const selectAnswer = useSelector(selectAnswerForQuestion(question));
    const answer: Answer | undefined = useSelector(selectAnswerForQuestion(question));
    const error: Boolean = answer?.error_msg.length > 0

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(addAnswer({question: question, val: event.target.value}))
    };

    return (
        <>
            <Input type="text"
                   id="text-entry-input"
                   aria-describedby=""
                   defaultValue={answer?.values.length ? answer?.values[0] : ""}
                   onKeyUp={handleInputChange}
                   title={error ? answer?.error_msg : ""}
                   className={error ? "border-red-500 focus-visible:ring-red-500" : ""}
            />

            {
                error && <p className="text-sm text-red-500 mt-1">{answer?.error_msg}</p>
            }
        </>

    )
}

const MultiChoiceItem: React.FC<{ question: ProfileQuestion, choice: UpkQuestionChoice }> = ({question, choice}) => {
    const dispatch = useAppDispatch()
    // const selectAnswer = useMemo(() => selectAnswerForQuestion(question), [question]);
    // const answer: Answer = useSelector(selectAnswer);
    const answer: Answer | undefined = useSelector(selectAnswerForQuestion(question));

    const selected: Boolean = (answer?.values || []).includes(choice.choice_id)

    return (
        <li key={choice.choice_id} style={{marginBottom: '0.5rem'}}>
            <Button
                onClick={() => dispatch(addAnswer({question: question, val: choice.choice_id}))}
                className="cursor-pointer"
                variant={selected ? "default" : "secondary"}
            >
                {choice.choice_text}
            </Button>
        </li>
    )
}

const MultipleChoice: React.FC<{ question: ProfileQuestion }> = ({question}) => {
    // const selectAnswer = useMemo(() => selectAnswerForQuestion(question), [question]);
    // const answer: Answer = useSelector(selectAnswer);

    const answer: Answer | undefined = useSelector(selectAnswerForQuestion(question));
    const error: Boolean = answer?.error_msg.length > 0

    return (
        <>
            {
                error && <p className="text-sm text-red-500 mt-1">{answer?.error_msg}</p>
            }

            <ol style={{listStyle: 'none', padding: 0, margin: 0}}>
                {
                    question.choices.map(c => {
                        return <MultiChoiceItem
                            key={`${question.question_id}-${c.choice_id}`}
                            question={question}
                            choice={c}/>
                    })
                }
            </ol>
        </>
    )
}


const ProfileQuestionFull: React.FC<{
    question: ProfileQuestion,
}> = ({question}) => {

    const dispatch = useAppDispatch()

    // const selectAnswer = useMemo(() => selectAnswerForQuestion(question), [question]);
    // const answer: Answer = useSelector(selectAnswer);
    const answer: Answer | undefined = useSelector(selectAnswerForQuestion(question));
    const app = useAppSelector(state => state.app)

    const provided_answer = answer?.values.length > 0
    const error: Boolean = answer?.error_msg.length > 0
    const can_submit = provided_answer && !error && !answer?.complete

    const renderContent = () => {
        switch (question.question_type) {
            case 'TE':
                return <TextEntry question={question}/>
            case 'MC':
                return <MultipleChoice question={question}/>
        }
    };

    const submitAnswerEvt = () => {
        dispatch(submitAnswer({question: question}))

        assert(!answer?.complete, "Can't submit completed Answer")
        assert(!answer?.processing, "Can't submit processing Answer")
        assert(answer?.error_msg.length == 0, "Can't submit Answer with error message")

        let body: BodySubmitProfilingQuestionsProductIdProfilingQuestionsPost = {
            'answers': [{
                "question_id": question.question_id,
                "answer": answer.values
            } as UserQuestionAnswerIn
            ]
        }
        new ProfilingQuestionsApiFactory().submitProfilingQuestionsProductIdProfilingQuestionsPost(app.bpid, app.bpuid, body)
            .then(res => {
                if (res.status == 200) {
                    dispatch(saveAnswer({question: question}))
                    dispatch(setNextQuestion())
                } else {
                    // let error_msg = res.data.msg
                }
            })
            .catch(err => console.log(err));
    }

    return (
        <Card className="@container/card relative overflow-hidden">
            {answer && answer.processing && (
                <motion.div
                    className="absolute top-0 left-0 h-0.5 bg-gray-300"
                    initial={{width: "0%"}}
                    animate={{width: "100%"}}
                    transition={{duration: 1, ease: "easeInOut"}}
                    // onAnimationComplete={() => setLoading(false)}
                />
            )}

            <Badge
                className="absolute top-2 right-2 h-5 min-w-5 rounded-full px-1 font-mono tabular-nums cursor-pointer"
                variant="outline"
                title={`Currently ${question.task_count.toLocaleString()} surveys use this profiling question`}
            >
                {question.task_count.toLocaleString()}
            </Badge>

            <CardHeader>
                <CardTitle>{question.question_text}</CardTitle>
            </CardHeader>
            <CardContent>
                {renderContent()}
            </CardContent>
            <CardFooter className="flex justify-end">
                <Button
                    type="submit"
                    className="w-1/3 cursor-pointer"
                    disabled={!can_submit}
                    onClick={submitAnswerEvt}
                >
                    Submit
                </Button>
            </CardFooter>
        </Card>
    )
}

const PaginationIcon: React.FC<{
    question: ProfileQuestion, idx: number,
}> = ({question, idx}) => {
    const dispatch = useAppDispatch()

    const answers = useAppSelector(state => state.answers)
    const completed: Boolean = Boolean(answers[question.question_id]?.complete)

    const setQuestion = (evt) => {
        if (completed) {
            evt.preventDefault()
        } else {
            dispatch(setQuestionActive(question))
        }
    }

    return (
        <PaginationItem>
            <PaginationLink
                href="#"
                title={question.question_text}
                isActive={question.active}
                aria-disabled={completed}

                onClick={setQuestion}
                className={clsx("cursor-pointer border border-gray-100",
                    {
                        "pointer-events-none opacity-50 cursor-not-allowed": completed,
                        "opacity-100 border-gray-200": question.active,
                    })}
            >
                {idx + 1}
            </PaginationLink>
        </PaginationItem>
    )
}


const QuestionsPage = () => {
    const dispatch = useAppDispatch()

    const questions = useSelector(selectQuestions)
    const question = useSelector(selectFirstAvailableQuestion)
    dispatch(setQuestionActive(question as ProfileQuestion))

    // This is saved now, so that if they click next it's ready. It
    // cannot be done within the click handler.
    const nextQuestion = useSelector(selectNextAvailableQuestion)

    const clickNext = () => {
        // TODO: if nextQuestion was already submitted, skip it!
        if (nextQuestion) {
            // TS is not smart enough to know that the if statement above
            // prevents this from ever being null
            dispatch(setQuestionActive(nextQuestion as ProfileQuestion))
        } else {
            // What do we do now... no more questions left to do.
        }
    }

    // All the variables needed for a sliding window
    const q_idx = questions.findIndex(q => q.question_id === question.question_id)
    const questionsWindow = (
        items: ProfileQuestion[], currentIndex: number, windowSize: number = 7
    ): ProfileQuestion[] => {
        const half: number = Math.floor(windowSize / 2)
        const total: number = items.length
        let start: number = currentIndex - half
        let end: number = currentIndex + half + 1

        if (start < 0) {
            end += Math.abs(start)
            start = 0
        }

        // Adjust if window goes past the end
        if (end > total) {
            const overflow: number = end - total
            start = Math.max(0, start - overflow)
            end = total
        }

        return items.slice(start, end)
    }

    return (
        <>
            <Pagination className="mt-4 mb-4">
                <PaginationContent>
                    {
                        questionsWindow(questions, q_idx).map(q => {
                            return <PaginationIcon
                                key={q.question_id}
                                question={q}
                                idx={questions.findIndex(qq => qq.question_id === q.question_id)}
                            />
                        })
                    }

                    <PaginationItem>
                        <PaginationNext
                            onClick={clickNext}
                            href="#"
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>

            <ProfileQuestionFull
                key={question.question_id}
                question={question}
                className="mt-4 mb-4"/>
        </>
    )
}

export {
    QuestionsPage
}