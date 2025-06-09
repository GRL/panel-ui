import React, {useState} from 'react'
import {Card, CardContent, CardHeader,} from "@/components/ui/card"
import {Tabs, TabsContent, TabsList, TabsTrigger,} from "@/components/ui/tabs"
import {Badge} from "@/components/ui/badge"

import {selectFixedCashoutMethods, selectVariableCashoutMethods} from "@/models/cashoutMethodSlice.ts";
import {CashoutMethodOut, UserWalletBalance} from "@/api"
import {formatCentsToUSD} from "@/lib/utils.ts";
import {useSelector} from 'react-redux'
import {motion} from "framer-motion";
import {Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle,} from "@/components/ui/drawer"
import {useAppSelector} from "@/hooks.ts";

const CashoutAcknowledgement = () => {
    return (
        <>
            <p>Your request has been successfully submitted!</p>
            <div className="form-group">
                <label htmlFor="cashout-acknowledgement-transaction-id-input">Transaction ID</label>
                <input type="email" className="form-control"
                       id="cashout-acknowledgement-transaction-id-input"
                       aria-describedby="transactionIdHelp"
                       readOnly/>
                <small id="transactionIdHelp" className="form-text">Request Status:
                    <strong>Pending</strong></small>
            </div>
            <p>Your redemption link will be on the <a href="/history/">history page</a>.</p>
        </>
    )
}

const CashoutReview: React.FC<{ cashout_method: CashoutMethodOut }> = ({cashout_method}) => {
    return (
        <>
            <p>You are about to redeem <strong id="cashout-review-redeem-amount"></strong> to a card.</p>
            <img src="<%= image_url %>" alt="..."/>
            <p>{cashout_method.name}</p>
            {/*<p>{data.terms}</p>*/}
            <button id="cashout-review-cancel" type="button"
                    className="btn btn-block">Cancel
            </button>
            <button id="cashout-review-submit" type="button"
                    className="btn btn-block">Submit
            </button>
            <p id="cashout-review-msg"></p>
        </>
    )
}

const VariableCashoutMethodPreview: React.FC<{ cashout_method: CashoutMethodOut }> = ({cashout_method}) => {
    return (
        <>
            <motion.h1
                initial={{opacity: 0, scale: 0.8, y: 10}}
                animate={{opacity: 1, scale: 1, y: 0}}
                transition={{
                    duration: 0.25,
                    type: "spring",
                    stiffness: 100,
                    damping: 10,
                }}
                className="font-bold text-center"
            >
                {cashout_method.name}
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
                className="text-center"
            >
                {formatCentsToUSD(cashout_method.min_value)} – {formatCentsToUSD(cashout_method.max_value)}
            </motion.h2>
        </>
    )
}

const FixedCashoutMethodPreview: React.FC<{ cashout_method: CashoutMethodOut }> = ({cashout_method}) => {
    return (
        <>
            <motion.h1
                initial={{opacity: 0, scale: 0.8, y: 10}}
                animate={{opacity: 1, scale: 1, y: 0}}
                transition={{
                    duration: 0.25,
                    type: "spring",
                    stiffness: 100,
                    damping: 10,
                }}
                className="font-bold text-center"
            >
                {cashout_method.name}
            </motion.h1>
        </>
    )
}


const CashoutMethodPreview: React.FC<{ cashout_method: CashoutMethodOut }> = ({cashout_method}) => {
    const [open, setOpen] = useState(false)

    const renderContent = () => {
        switch (cashout_method.data.value_type) {
            case 'fixed':
                return <FixedCashoutMethodPreview cashout_method={cashout_method}/>
            case 'variable':
                return <VariableCashoutMethodPreview cashout_method={cashout_method}/>
        }
    };


    return (
        <Card
            key={cashout_method.id}
            className="@container/card relative overflow-hidden h-full min-h-[140px] flex flex-col justify-between cursor-pointer"
        >
            <CardHeader>
                {renderContent()}
            </CardHeader>

            <CardContent>
                <img
                    className="grayscale blur-[1px] transition-all duration-300 hover:grayscale-0 hover:blur-none"
                    alt="Cashout method"
                    src={cashout_method.image_url}/>
            </CardContent>

            <Badge
                className="absolute bottom-1 right-1 h-5 min-w-5 rounded-full px-1 font-mono tabular-nums cursor-pointer"
                variant="outline"
                title="Cashout Details"
                onClick={() => setOpen(true)}
            >Details
            </Badge>

            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>{cashout_method.name} Details</DrawerTitle>
                        <DrawerDescription>
                            <div dangerouslySetInnerHTML={{__html: cashout_method.description}}/>
                        </DrawerDescription>
                    </DrawerHeader>
                </DrawerContent>
            </Drawer>

        </Card>
    )
}


const CashoutMethodsPage = () => {
    const variableCashoutMethods = useSelector(selectVariableCashoutMethods)
    const fixedCashoutMethods = useSelector(selectFixedCashoutMethods)
    const wallet: UserWalletBalance = useAppSelector(state => state.wallet)


    return (
        <>
            <p>Your balance is <strong>{formatCentsToUSD(wallet.amount)}</strong>.</p>
            <p>You can redeem <strong>{formatCentsToUSD(wallet.redeemable_amount)}</strong> now.</p>
            <p><small>(a portion of each survey is delayed by 30 days)</small></p>

            <Tabs defaultValue="dynamic">
                <TabsList
                    className="cursor-pointer"
                >
                    <TabsTrigger value="dynamic">Variable</TabsTrigger>
                    <TabsTrigger value="fixed">Fixed</TabsTrigger>
                </TabsList>

                <TabsContent value="dynamic">
                    <div className="grid grid-cols-3 gap-1 p-1">
                        {
                            variableCashoutMethods.map((m, index) => {
                                return <CashoutMethodPreview key={index} cashout_method={m}/>;
                            })
                        }
                    </div>
                </TabsContent>
                <TabsContent value="fixed">
                    <div className="grid grid-cols-3 gap-1 p-1">
                        {
                            fixedCashoutMethods.map((m, index) => {
                                return <CashoutMethodPreview key={index} cashout_method={m}/>;
                            })
                        }
                    </div>
                </TabsContent>
            </Tabs>
        </>
    )
}


export {CashoutMethodsPage}