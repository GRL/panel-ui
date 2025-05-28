import {CashoutMethodOut} from "@/api/models/cashout-method-out.ts"

export class CashoutMethod implements CashoutMethodOut {
    id: string;  // uuid
    currency: string;  // 3-letter all caps
    originalCurrency: string;  // 3-letter all caps
    data: any;
    description: string;  // html description
    imageUrl: string;  // cloudfront cdn
    maxValue: number;  // pixels int
    minValue: number;  // pixels int
    name: string;
    type: string;  // TANGO
    extId: string;  // U179271
    productId?: any;
    productUserId?: any;

    constructor(data) {
        this.originalCurrency = data.original_currency;
        this.currency = data.currency;
        this.data = data.data;
        this.description = data.description;
        this.extId = data.ext_id;
        this.id = data.id;
        this.imageUrl = data.image_url;
        this.maxValue = data.max_value;
        this.minValue = data.min_value;
        this.name = data.name;
        this.type = data.type;

    }

}