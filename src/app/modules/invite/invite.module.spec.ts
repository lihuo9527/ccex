import { InviteModule } from './invite.module';

describe('InviteModule', () => {
  let inviteModule: InviteModule;

  beforeEach(() => {
    inviteModule = new InviteModule();
  });

  it('should create an instance', () => {
    expect(inviteModule).toBeTruthy();
  });
});
