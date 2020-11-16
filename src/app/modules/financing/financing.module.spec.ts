import { FinancingModule } from './financing.module';

describe('FinancingModule', () => {
  let financingModule: FinancingModule;

  beforeEach(() => {
    financingModule = new FinancingModule();
  });

  it('should create an instance', () => {
    expect(financingModule).toBeTruthy();
  });
});
