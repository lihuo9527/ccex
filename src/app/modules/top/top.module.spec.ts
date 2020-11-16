import { TopModule } from './top.module';

describe('TopModule', () => {
  let topModule: TopModule;

  beforeEach(() => {
    topModule = new TopModule();
  });

  it('should create an instance', () => {
    expect(topModule).toBeTruthy();
  });
});
