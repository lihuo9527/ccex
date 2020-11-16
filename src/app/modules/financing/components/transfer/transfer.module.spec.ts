import { TransferModule } from './transfer.module';

describe('TransferModule', () => {
  let transferModule: TransferModule;

  beforeEach(() => {
    transferModule = new TransferModule();
  });

  it('should create an instance', () => {
    expect(transferModule).toBeTruthy();
  });
});
