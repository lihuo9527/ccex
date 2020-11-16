import { IFilterable } from '../../../models/common-interfaces';
export class BonusRecord {
    constructor(
        public coin: string,
        public amount: number,
        public createdAt: number,
        public name: string = null,
        public invitedAt: number = 0,
        public generation: string = null,
    ) { }
}

export class PurchaseOrder implements IFilterable {
    now = Date.now();
    isVisible: boolean = true;
    constructor(
        public id: string,
        public productId: string,
        public name: string,
        public coin: string,
        public amount: number = 0,
        public createdAt: number,
        public startsAt: number,
        public endsAt: number,
        public interest: number = 0,
        public damageRatio: number = 30,
        public isOperationVisible: boolean = true,
    ) { }
}

export class Balance {
    constructor(
        public total: number = 0,
        public free: number = 0,
        public locked: number = 0,
        public interest: number = 0,
        public profit: number = 0,
        public yesterdayProfit: number = 0
    ) { }
}

export class ProductDetails {
    constructor(
        public id: string,
        public name: string,
        public name_zh: string,
        public coin: string,
        public endsAt: number,
        public minPurchaseAmount: number,
        public term: number,
        public displayAnnualInterestRate: string,
        public availableAmount: number = null,
        public riskLevel: number = null,
        public filledType: 'gt' | 'lt' = null,
        public precision: number = 0,
        public description: any = null,
        public description_zh: any = null,
    ) { }
}

export class TransferRecord {
    constructor(
        public coin: string,
        public amount: string,
        public direction: number,
        public createdAt: number,
    ) { }
}

export class TransferObject {
    constructor(
        public coin: string,
        public maxTransferIn: number = 0,
        public maxTransferOut: number = 0,
    ) { }
}

export class DefreezeRecord {
    constructor(
        public coin: string,
        public amount: number,
        public createdAt: number,
    ) { }
}