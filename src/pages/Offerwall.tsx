import React from 'react'
import {Separator} from "@/components/ui/separator"
import {Link} from '@mui/material';

import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import {CheckIcon, MessageCircleQuestionIcon, XIcon} from "lucide-react"
import {SoftPairBucket} from "@/api/models/soft-pair-bucket.ts"
import {useAppSelector} from '@/hooks'

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

const CallToAction: React.FC<SoftPairBucket> = ({bucket}) => {
    switch (bucket.eligibility) {
        case "eligible":
            return <Link href={bucket.uri}>
                <button type="button">
                    Start Survey
                </button>
            </Link>;
        case "conditional":
            return <button type="button">
                Unlock Survey
            </button>;

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