import React, {useState} from 'react'
import { motion } from "framer-motion";
import {Badge} from "@/components/ui/badge"
import {Link} from '@mui/material';
import {Tabs, TabsContent} from "@/components/ui/tabs"
import {Button} from "@/components/ui/button"
import {
    BodyOfferwallSoftpairPostProductIdOfferwall37d1da64OfferwallIdPost,
    BucketTask,
    OfferwallApi,
    SoftPairBucket,
    UserQuestionAnswerIn
} from "@/api"

import {ColumnDef, flexRender, getCoreRowModel, useReactTable,} from "@tanstack/react-table"

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {useSelector} from "react-redux";
import {Switch} from "@/components/ui/switch"
import {Card, CardContent, CardFooter} from "@/components/ui/card.tsx";
import {makeSelectQuestionsByIds, ProfileQuestion} from "@/models/questionSlice.ts"
import {CheckIcon, MessageCircleQuestionIcon, XIcon} from "lucide-react"
import {useAppDispatch, useAppSelector} from '@/hooks'
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger,} from "@/components/ui/sheet"
import {ProfileQuestionFull} from "@/pages/Questions.tsx"
import {Answer, selectAnswerForQuestion, submitAnswer} from "@/models/answerSlice.ts";
import {assert, formatCentsToUSD, formatSeconds} from "@/lib/utils.ts";
import {IQRBoxPlot} from "@/lib/snippets.tsx"
import {setAvailabilityCount, setOfferwallId} from "@/models/appSlice.ts";
import {setBuckets} from "@/models/bucketSlice.ts";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

const BucketStatus: React.FC<SoftPairBucket> = ({bucket}) => {
    switch (bucket.eligibility) {
        case "unconditional":
            return <
                CheckIcon
                xlinkTitle="you are good"
            />;
        case "conditional":
            return <MessageCircleQuestionIcon/>;
        case "ineligible":
            return <XIcon/>;
    }
}

const ContentsGrid: React.FC<SoftPairBucket> = ({bucket}) => {

    const columns: ColumnDef<BucketTask>[] = [
        {
            accessorKey: "loi",
            header: "Length",
            cell: ({ getValue }) => formatSeconds(getValue() as number),
        },
        {
            accessorKey: "payout",
            header: "Payout",
            cell: ({ getValue}) => formatCentsToUSD(getValue() as number)
        },
    ]

    const data: BucketTask[] = bucket.contents

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div className="max-h-[120px] overflow-y-auto border rounded-md">
            <Table className="text-sm [&_th]:px-2 [&_td]:px-2 [&_th]:py-1 [&_td]:py-1" >
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>

                <TableBody>
                    {
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
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
        case "unconditional":
            return (
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-[90%]">
                    <Link
                        href={bucket.uri}
                        target="_blank"
                        className="w-full h-8 cursor-pointer"
                    >
                        <Button
                            className="w-full h-8 cursor-pointer"
                        >
                            Start Survey
                        </Button>
                    </Link>
                </div>
            )
        case "conditional":
            // return <ConditionalQuestions bucket={bucket}/>
            return (
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-[90%]">
                    <Button
                        variant="secondary"
                        className="w-full h-8 cursor-pointer"
                    >
                        Check Eligibility
                    </Button>
                </div>
            )

        case "ineligible":
            return <button type="button">
                Ineligible Survey
            </button>;
    }
}

const ConditionalBucket: React.FC<SoftPairBucket> = ({bucket}) => {
    const [tab, setTab] = useState("bucket_cta")
    const toggleTab = () => setTab(tab === "bucket_cta" ? "bucket_details" : "bucket_cta")

    return (

        <Card
            key={bucket.id}
            className="@container/card relative overflow-hidden h-full min-h-[140px] flex flex-col justify-between"

        >

            <Badge
                className="absolute top-1 left-1 h-5 min-w-5 rounded-full px-1 font-mono tabular-nums cursor-pointer"
                variant="outline"
                title={`There are ${bucket.contents.length.toLocaleString()} surveys in this bucket`}
            >{bucket.contents.length.toLocaleString()}
            </Badge>

            <div
                className="absolute top-0.5 right-0.5 h-4"
            >
                <Switch id="mode"
                        checked={tab === "bucket_details"}
                        onCheckedChange={toggleTab}/>
            </div>

            <CardContent className="flex items-center gap-2">
                <Tabs
                    value={tab} onValueChange={setTab}
                    defaultValue="bucket_cta"
                    className="w-full"
                >
                    <TabsContent value="bucket_cta">
                        <motion.h1
                            initial={{opacity: 0, scale: 0.8, y: 10}}
                            animate={{opacity: 1, scale: 1, y: 0}}
                            transition={{
                                duration: 0.25,
                                type: "spring",
                                stiffness: 100,
                                damping: 10,
                            }}
                            className="text-2xl font-bold text-center"
                        >
                            {formatCentsToUSD(bucket.payout)}
                        </motion.h1>
                        <motion.h2
                            initial={{opacity: 0, scale: 0.8, y: 10}}
                            animate={{opacity: 1, scale: 1, y: 0}}
                            transition={{
                                duration: 0.25,
                                type: "spring",
                                stiffness: 100,
                                damping: 10,
                            }}
                            className="text-2xl font-bold text-center"
                        >
                            {formatSeconds(bucket.loi)}
                        </motion.h2>

                        <CallToAction bucket={bucket}/>
                    </TabsContent>

                    <TabsContent value="bucket_details">
                        <ContentsGrid bucket={bucket}></ContentsGrid>
                    </TabsContent>
                </Tabs>

                {/*<StarIcon className="w-5 h-5 fill-[#FFD700]"/>*/}
                {/*<span className="text-sm">4.5</span>*/}

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
            </CardFooter>

        </Card>
    )
}

const Offerwall = () => {
    const buckets = useAppSelector(state => state.buckets)

    return (
        <div className="grid grid-cols-3 gap-2 p-1">
            {buckets.map((bucket) => (
                <ConditionalBucket key={bucket.id} bucket={bucket}/>
            ))}
        </div>
    )
}

export {
    Offerwall
}