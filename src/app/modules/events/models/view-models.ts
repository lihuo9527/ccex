export class LottoDetail {
    constructor(
        public id: string,
        public name: string,
        public name_zh: string,
        public coin: string,
        public endsAt: number,
        public min: number,
        public max: number,
        public event: any = null,
        public description: any = null,
        public description_zh: any = null,
        public catalog: string = null,
    ) { }
}

export class LottoRecord {
    constructor(
        public id: string,
        public name: string,
        public coin: string,
        public amount: number,
        public createdAt: number,
        public consumedBy: any = null,
    ) { }
}

export class Event {
    constructor(
        public id: string,
        public name: string,
        public name_zh: string,
        public description: any = null,
        public description_zh: any = null,
        public coin: string,
        public bonusCoin: string,
        public fromPair: string,
        public precision: number,
        public bonusCoinPrecision: number,
        public lengthInDay: number,
        public minPurchase: number,
        public delayInDay: number,
        public startsAt: number,
        public endsAt: number,
        public catalog: string = null,
    ) { }
}

export class ParticipationRecord {
    constructor(
        public id: string,
        public eventId: string,
        public eventName: string,
        public eventCoin: string,
        public amount: number,
        public createdAt: number,
        public startsAt: number,
        public endsAt: number,
        public bonusCoin: string,
        public isComplete: any,
        public currentParticipation: string,
    ) { }
}

export class AirDropRecord {
    constructor(
        public reason: any,
        public coin: string,
        public amount: number,
        public createdAt: number,
    ){}
}

