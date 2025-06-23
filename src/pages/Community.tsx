import React, {useEffect, useState} from 'react'

import {Card, CardContent, CardHeader} from "@/components/ui/card.tsx";
import {CashoutMethodOut, CashoutMethodsResponse, WalletApi} from "@/api"
import {useAppSelector} from "@/hooks.ts";

const CashoutMethodPreview: React.FC<{ cashout_method: CashoutMethodOut }> = ({cashout_method}) => {

    console.log("CashoutMethodPreview", cashout_method)

    return (
        <Card key={cashout_method.id}>
            <CardHeader>
                {cashout_method.name}
            </CardHeader>

            <CardContent>
                <img className="blur-xs grayscale" src={cashout_method.image_url}/>
            </CardContent>
        </Card>
    )
}

const CommunityPage = () => {
    const app = useAppSelector(state => state.app)

    const [cashoutMethods, setCashoutMethods] = useState([]);

    useEffect(() => {
        const x = new WalletApi();
        x.getCashoutMethodsProductIdCashoutMethodsGet(app.bpid, app.bpuid)
            .then(res => {
                const data: CashoutMethodsResponse = res.data;
                setCashoutMethods(data.cashout_methods);
            })
            .catch(err => console.log(err));
    }, []); // ← empty array means "run once"

    return (
        <div className="grid grid-cols-3 gap-1 p-1">
            {
                cashoutMethods.map((m, index) => {
                    return <CashoutMethodPreview key={index} cashout_method={m}/>;
                })
            }
        </div>
    );
}

export {CommunityPage}