import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DepositRecord, AssetPortfolioRecord, WithdrawRecord, DepositObject, WithdrawObject } from '../../models/view-models';
import { WalletTabId } from '../../models/wallet-tab-id';
import { ApiClientService } from 'src/app/services/api-client.service';
import { ErrorType } from 'src/app/models/error';
import { FiatPriceService } from 'src/app/services/fiat-price.service';
import { LocalizationService } from 'src/app/services/localization.service';
import { HttpClientService } from 'src/app/services/http-client.service';
import { COINS_PATH } from 'src/constants/path';
import { NzModalService } from 'ng-zorro-antd';
import { GoogleVaildate } from 'src/app/modules/share/google-validate/google-validate.component';
import { WalletMessages, WITHDRAW } from 'src/app/modules/share/messages/messages';
import { PrecisionUtility } from 'src/app/modules/share/classes/precision-utility';
@Component({
  selector: 'ccex-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.less']
})
export class BalanceComponent implements OnInit {
  currentTabId: number = 0;
  isRecordsLoading = false;
  isPortfolioLoading = false;
  isWithdrawLoading = false;
  isDepositPopupVisible: boolean = false;
  isWithdrawPopupVisible: boolean = false;
  isDepositAddressLoading: boolean = true;
  isGoogleValidateLoading: boolean = false;
  pendingDeposit: DepositRecord[] = [];
  assetPortfolio: AssetPortfolioRecord[] = [];
  depositRecords: DepositRecord[] = [];
  withdrawRecords: DepositRecord[] = [];
  withdrawInputDisabled: boolean = true;
  coinsObj: any[] = [];
  keyword: string = '';
  depositObj: DepositObject = new DepositObject();
  withdrawObj: WithdrawObject = new WithdrawObject();
  private googleVaildate = new GoogleVaildate();
  private account: any;

  private totalFiatValue = 0;
  get TotalFiatValue() {
    return PrecisionUtility.truncate(this.totalFiatValue, 2, 'string');
  }
  private totalBtcValue = 0;
  get TotalBtcValue() {
    return PrecisionUtility.truncate(this.totalBtcValue, 8, 'string');
  }
  get BtcFiatPrice() {
    if (this.totalBtcValue <= 0) return '--.--';
    return PrecisionUtility.truncate((this.totalFiatValue / this.totalBtcValue), 2, 'string');
  }

  constructor(
    private route: ActivatedRoute,
    private apiClient: ApiClientService,
    private fiatPrice: FiatPriceService,
    public localize: LocalizationService,
    private http: HttpClientService,
    private modalService: NzModalService,
    private router: Router,
  ) {

  }

  ngOnInit() {
    this.currentTabId = this.route.snapshot.data.tabId;
    this.fetchRecords();
    this.getCoins()
      .then(() => this.apiClient.profile())
      .then(data => {
        this.account = data;
        return this.fetchPortfolio();
      })
      .then(() => this.fiatPrice.fetch())
      .then(marketPrices=> {
        let coins = this.assetPortfolio.map(coin => { return { symbol: coin.coinSymbol, amount: coin.amount } });
        let btcValue = this.fiatPrice.calculate(marketPrices, coins, 'BTC', 'USDT');
        let usdtValue = this.fiatPrice.calculate(marketPrices, [{symbol: 'BTC', amount: btcValue}], 'USDT');
        let usdValue = this.fiatPrice.calculate(marketPrices, [{symbol: 'USDT', amount: usdtValue}], 'USD');

        this.totalBtcValue = btcValue;
        this.totalFiatValue = usdValue;
      });
  }

  private async fetchRecords() {
    this.isRecordsLoading = true;
    try {
      let coins = await this.apiClient.fetchCoins() || [];
      let depositHistories = (await this.apiClient.fetchDepositHistory()).sort((a, b) => { return Number(b.createdAt) - Number(a.createdAt) });
      for (let record of depositHistories) {
        let coin = coins.find(coin => coin._id === record.coin);
        let deposit = new DepositRecord(
          record.txid,
          record.coin,
          coin.name || record.coin,
          record.amount,
          Number(record.createdAt),
          Number(record.updatedAt)
        );
        if (deposit.IsDone) {
          this.depositRecords.push(deposit);
        } else {
          this.pendingDeposit.push(deposit);
        }
      }
      let withdrawHistories = (await this.apiClient.fetchWithdrawHistory()).sort((a, b) => { return Number(b.createdAt) - Number(a.createdAt) });
      for (let record of withdrawHistories) {
        let coin = coins.find(coin => coin._id === record.coin);
        let withdrawRecord = new WithdrawRecord(
          record.txid,
          record.coin,
          coin.name || record.coin,
          record.address,
          record.amount,
          Number(record.createdAt),
          Number(record.updatedAt)
        )
        withdrawRecord.status = this.getWithdrawRecordStatus(withdrawRecord);
        this.withdrawRecords.push(withdrawRecord);
      }

    } catch (e) {
      console.error(e);
      if (e.code === ErrorType.UNAUTHENTICATED) {
        this.apiClient.logout();
      }
    }
    this.isRecordsLoading = false;
  }

  getWithdrawRecordStatus(withdrawRecord: any): string {
    if (!withdrawRecord.updatedAt && !withdrawRecord.txid) {
      return 'COMMON.VALIDATING';
    } else if (!withdrawRecord.txid) {
      return 'COMMON.IN_PROCESS';
    } else if (!withdrawRecord.updatedAt) {
      return 'COMMON.FAILURE';
    } else {
      return 'COMMON.SUCCESS';
    }
  }

  private async fetchPortfolio() {
    this.isPortfolioLoading = true;
    try {
      let markets: any[] = await this.apiClient.fetchMarkets() || [];
      let coins: any[] = (await this.apiClient.fetchCoins() || []).sort((a, b) => a.sortOrder > b.sortOrder ? 1 : -1);
      let balances = await this.apiClient.fetchBalances();
      for (let coin of coins) {
        let balance = balances.find(balance => coin._id === balance.coin);
        let pairStrings = [];
        for (let item of markets) {
          if (item.targetCoin === coin._id || item.marketCoin === coin._id) {
            pairStrings.push(`${item.targetCoin}-${item.marketCoin}`);
          }
        }
        this.assetPortfolio.push(new AssetPortfolioRecord(
          coin.canDeposit,
          coin.canWithdraw,
          coin.sortOrder,
          pairStrings,
          coin._id,
          coin.name,
          !balance ? 0 : balance.free + balance.locked,
          !balance ? 0 : balance.free,
          !balance ? 0 : Math.abs(balance.locked),
          0
        ));
      }
    } catch (e) {
      console.error(e);
      if (e.code === ErrorType.UNAUTHENTICATED) {
        this.apiClient.logout();
      }
    }
    this.isPortfolioLoading = false;
  }

  sortPortfolio(sort: { key: string, value: string }): void {
    if (sort.value === null) return;
    const data = this.assetPortfolio.filter(item => true);
    this.assetPortfolio = data.sort((a, b) =>
      (sort.value === 'ascend') ?
        (a[sort.key] > b[sort.key] ? 1 : -1) :
        (b[sort.key] > a[sort.key] ? 1 : -1)
    );
  }

  onTab(tabIndex: number) {
    this.keyword = '';
    this.filterInternal();
    this.currentTabId = tabIndex;
  }

  filter(event: any) {
    let token: string = event.target.value;
    this.keyword = token.toLowerCase().trim();
    this.filterInternal();
  }

  private filterInternal() {
    let items: any[];
    switch (this.currentTabId) {
      case WalletTabId.Balance:
        items = this.assetPortfolio;
        break;
      case WalletTabId.Deposit:
        items = this.depositRecords;
        break;
      case WalletTabId.Withdraw:
        items = this.withdrawRecords;
        break;
      default:
        throw new Error('unknow wallet tab id: ' + this.currentTabId);
    }
    for (let item of items) {
      if (this.keyword.length === 0) {
        item.isVisible = true;
        continue;
      }
      item.isVisible = item.coinName.toLowerCase().includes(this.keyword) ||
        item.coinSymbol.toLowerCase().includes(this.keyword);
    }
  }

  async deposit(coin: string) {
    this.depositObj.info = this.getCoinInfo(coin);
    this.isDepositPopupVisible = true;
    try {
      let response = await this.apiClient.fetchAddress(coin);
      if (response.errors) {
        throw new Error(response.errors[0].msg);
      }
      if (response.startsWith('<')) return;
      if (coin === 'XRP') {
        let arr = response.replace(/"/g, '').split(' ');
        this.depositObj.url = arr[0];
        this.depositObj.tag = arr[1];
      }
      else if (coin === 'EOS') {
        let arr = response.replace(/"/g, '').split(' ');
        this.depositObj.url = arr[0];
        this.depositObj.tag = arr[1];
      } else {
        this.depositObj.url = response.replace(/"/g, '');
      }
      this.isDepositAddressLoading = false;
    } catch (e) {
      console.error(e);
    }
  }

  onDepositPopupClose() {
    this.isDepositPopupVisible = false;
    this.isDepositAddressLoading = true;
    this.depositObj.initialize();
  }

  getCoins() {
    return this.http.get(COINS_PATH).then(data => {
      this.coinsObj = data;
      return Promise.resolve();
    });
  }

  async enterWithdraw(coin: string) {
    if (!this.account.isTwoStepEnabled) {
      this.router.navigate(['/settings/google-authentication']);
      return;
    }
    this.withdrawObj.id = coin;
    this.isWithdrawPopupVisible = true;
    this.isWithdrawLoading = true;
    try {
      this.withdrawObj.info = await this.apiClient.tryWithdraw(coin);
      let arr = `${this.withdrawObj.info.dailyAvailable}`.split('.');
      if (arr.length > 1) {
        this.withdrawObj.info.dailyAvailable = Number(`${arr[0]}.${arr[1].slice(0, 2)}`);
      }
      this.withdrawObj.info.dailyAvailable = PrecisionUtility.truncate(this.withdrawObj.info.dailyAvailable, 2, 'string');
      this.isWithdrawLoading = false;
      this.withdrawInputDisabled = false;
    } catch (e) {
      console.error(e);
    }
  }

  async tryWithdraw() {
    if (!this.withdrawObj.address) {
      this.showErrorPopup(WITHDRAW.ADDRESS_INVALID);
      return;
    }
    if (this.withdrawObj.amount < Number(this.withdrawObj.info.minWithdraw)) {
      this.showErrorPopup(WITHDRAW.AMOUNT_NOT_ENOUGH);
      return;
    }
    if (this.withdrawObj.amount > Number(this.withdrawObj.info.available)) {
      this.showErrorPopup(WITHDRAW.BALANCE_NOT_ENOUGH);
      return;
    }
    this.googleVaildate.show();
  }

  async withdraw(event: any) {
    this.isGoogleValidateLoading = true;
    try {
      let address = this.withdrawObj.address;
      if (this.withdrawObj.id === 'XRP' && this.withdrawObj.tag && this.withdrawObj.tag.length > 0) {
        address = `${address.trim()} ${this.withdrawObj.tag.trim()}`;
      }
      if (this.withdrawObj.id === 'EOS' && this.withdrawObj.tag && this.withdrawObj.tag.length > 0) {
        address = `${address.trim()} ${this.withdrawObj.tag.trim()}`;
      }
      await this.apiClient.withdraw(address.trim(), this.withdrawObj.id, this.withdrawObj.amount, event.code);
      this.showSuccessPopup(WITHDRAW.SUCCESS);
    } catch (e) {
      this.showErrorPopup(e.code);
      console.error(e);
    }
    this.isGoogleValidateLoading = false;
  }

  showSuccessPopup(successType: number) {
    this.googleVaildate.hidden();
    this.onWithdrawPopupClose();
    let msgObj = new WalletMessages(this.localize.currentLanguage.id).getMessage(successType);
    let modalRef = this.modalService.success({
      nzTitle: msgObj.title,
      nzContent: msgObj.text
    });
    modalRef.afterClose.subscribe(() => window.location.reload());

  }

  showErrorPopup(errorType: number) {
    this.googleVaildate.hidden();
    let msgObj = new WalletMessages(this.localize.currentLanguage.id).getMessage(errorType);
    let modalRef = this.modalService.warning({
      nzTitle: msgObj.title,
      nzContent: msgObj.text
    });
    setTimeout(() => modalRef.close(), 5000);
  }

  checkWithdrawAmout() {
    this.withdrawObj.actualArrival = this.withdrawObj.amount - Number(this.withdrawObj.info.fee);
  }

  onWithdrawPopupClose() {
    this.isWithdrawPopupVisible = false;
    this.withdrawObj.initialize();
  }

  getCoinInfo(coin: string) {
    for (let element of this.coinsObj) {
      if (element.id === coin) return element;
    }
  }

}