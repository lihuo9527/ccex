import { TradeModule } from './trade.module';

describe('TradeModule', () => {
  let tradeModule: TradeModule;

  beforeEach(() => {
    tradeModule = new TradeModule();
  });

  it('should create an instance', () => {
    expect(tradeModule).toBeTruthy();
  });
});
