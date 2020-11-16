export class Account {
  email: string;
  isTwoStepEnabled: boolean;
  twoStep: string;
  otpAuthUrl: string;
  recentLogins: RecentLogin[];
  depositHistory: DepositRecord[];
  withdrawHistory: WithdrawRecord[];
  createdAt: number;
}

class RecentLogin {
  createdAt: number;
  ip: string;
}

class DepositRecord {
  txid: string;
  coin: string;
  amount: number;
  createdAt: number;
  updatedAt: number;
}

class WithdrawRecord {
  txid: string;
  coin: string;
  amount: number;
  address: string;
  createdAt: number;
  updatedAt: number;
}