import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { Router } from '@angular/router';
import { OrderType } from '../modules/order/models/view-models';
import { Exception } from '../models/error';
import { environment } from 'src/environments/environment';
import { LocalizationService } from './localization.service';
import { MessagePopupType, MessagePopup } from 'src/app/modules/share/message-popup/message-popup';
declare var initGeetest;

@Injectable({
  providedIn: 'root'
})
export class ApiClientService {
  private readonly kLocalStorageKey = 'GLENBIT_CURRENT_USER';
  private isPhoneNum = false;

  get currentUser() {
    return localStorage.getItem(this.kLocalStorageKey);
  }
  clearCurrentUser() {
    localStorage.removeItem(this.kLocalStorageKey);
  }

  constructor(
    private router: Router,
    private httpClient: HttpClientService,
    private localize: LocalizationService
  ) { }

  async getCaptchaObject(onSuccessCallback: (gt: any) => void) {
    let response = await this.httpClient.get(environment.baseUrl + '/gt/register?t=' + Date.now());
    let captchaObj = await this.initializeGeetest(response);
    captchaObj.onSuccess(() => {
      let validGt = captchaObj.getValidate();
      if (!validGt) {
        let msgObj = this.localize.currentLanguage.id === 'zh_CN' ? { title: "错误：", text: "请稍后重试！", confirm: "确认" } : { title: "Error：", text: "Please retry again later :(", confirm: "Confirm" };
        MessagePopup.show(MessagePopupType.WARNING, msgObj.title, msgObj.text, msgObj.confirm);
        return;
      }
      onSuccessCallback(validGt);
    });
    return captchaObj;
  }

  private initializeGeetest(response: any) {
    return new Promise<any>(resolve => initGeetest(
      {
        gt: response.gt,
        challenge: response.challenge,
        offline: !response.success,
        new_captcha: response.new_captcha,
        product: "bind",
        lang: this.localize.currentLanguage.id === 'zh_CN' ? 'zh-cn' : 'en'
      },
      captchaObj => resolve(captchaObj)
    ));
  }

  // ----------------------------------------
  // Account
  // ----------------------------------------
  async signup(email: string, password: string, gt: any, referralCode: string) {
    return await this.call(
      '/account/signup',
      [
        'email', email,
        'password', password,
        'lang', this.localize.currentLanguage.id,
        'geetest_challenge', gt.geetest_challenge,
        'geetest_validate', gt.geetest_validate,
        'geetest_seccode', gt.geetest_seccode,
        'referralCode', referralCode
      ]
    );
  }

  async signupByPhone(countryCode: string, phone: string, password: string, code: string, gt: any, referralCode: string) {
    return await this.call(
      '/account/signup_phone',
      [
        'countryCode', countryCode,
        'phone', phone,
        'password', password,
        'code', code,
        'geetest_challenge', gt.geetest_challenge,
        'geetest_validate', gt.geetest_validate,
        'geetest_seccode', gt.geetest_seccode,
        'referralCode', referralCode
      ]
    );
  }

  async login(email: string, password: string, gt: any) {
    this.isPhoneNum = /^\d+$/.test(email);
    await this.call(
      '/account/login',
      [
        'email', email,
        'password', password,
        'geetest_challenge', gt.geetest_challenge,
        'geetest_validate', gt.geetest_validate,
        'geetest_seccode', gt.geetest_seccode
      ]
    );
    localStorage.setItem(this.kLocalStorageKey, email);
  }

  async login_ga(email: string, password: string, verifyCode: string) {
    this.isPhoneNum = /^\d+$/.test(email);
    await this.call(
      '/account/login_ga',
      [
        'email', email,
        'password', password,
        'token', verifyCode
      ]
    );
    localStorage.setItem(this.kLocalStorageKey, email);
  }

  async sendSmsVerifyCode(countryCode: string, phone: string) {
    return await this.call(
      '/account/sms_verify_code',
      [
        'countryCode', countryCode,
        'phone', phone
      ]
    );
  }

  async verifyPhone(countryCode: string, phone: string, code: string) {
    return await this.call(
      '/account/verify_phone',
      [
        'countryCode', countryCode,
        'phone', phone,
        'code', code
      ]
    );
  }

  async logout() {
    document.cookie = 'UM_distinctid=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    this.logoutInternal();
    return await this.call('/account/logout', []);
  }
  private logoutInternal() {
    this.clearCurrentUser();
    this.router.navigate([this.isPhoneNum ? '/account/login_phone' : '/account/login', { returnUrl: this.router.url }]);
  }

  verifyLogin() {
    if (!this.currentUser) this.router.navigate(['/account/login', { returnUrl: this.router.url }]);
    return this.currentUser;
  }

  async profile() {
    return await this.call('/account/profile', []);
  }

  // ----------------------------------------
  // Reset password, two-step authentication
  // ----------------------------------------

  async tryResetPasswordByEmail(email: string) {
    return await this.call(
      '/account/try_reset_password',
      !email ?
        [] :
        [
          'email', email
        ]
    );
  }

  async tryResetPasswordByPhone(countryCode: string, phone: string) {
    return await this.call(
      '/account/try_reset_password_phone',
      !countryCode && !phone ?
        [] :
        [
          'countryCode', countryCode,
          'phone', phone,
        ]
    );
  }

  async resetPasswordByEmail(email: string, password: string, code: string, gt: any) {
    return await this.call(
      '/account/reset_password',
      [
        'email', email,
        'password', password,
        'code', code,
        'geetest_challenge', gt.geetest_challenge,
        'geetest_validate', gt.geetest_validate,
        'geetest_seccode', gt.geetest_seccode
      ]
    );
  }

  async resetPasswordByPhone(countryCode: string, phone: string, password: string, code: string, gt: any) {
    return await this.call(
      '/account/reset_password_phone',
      [
        'countryCode', countryCode,
        'phone', phone,
        'password', password,
        'code', code,
        'geetest_challenge', gt.geetest_challenge,
        'geetest_validate', gt.geetest_validate,
        'geetest_seccode', gt.geetest_seccode
      ]
    );
  }

  async modifyPasswordByEmail(password: string, code: string) {
    return await this.call(
      '/account/modify_password',
      [
        'password', password,
        'code', code,
      ]
    );
  }

  async modifyPasswordByPhone(password: string, code: string) {
    return await this.call(
      '/account/modify_password_phone',
      [
        'password', password,
        'code', code,
      ]
    );
  }

  async resetTwoStep() {
    return await this.call(
      '/account/reset_two_step',
      []
    );
  }

  async disableTwoStep(token: string) {
    return await this.call(
      '/account/disable_two_step',
      ['token', token]
    );
  }

  async enableTwoStep(token: string) {
    return await this.call(
      '/account/enable_two_step',
      ['token', token]
    );
  }
  async TwoStepVerifyCode(code: string) {
    return await this.call(
      '/account/two_step_verify_code',
      ['code', code]
    );
  }

  // ----------------------------------------
  // Assets
  // ----------------------------------------
  async fetchAddress(coin: string) {
    return await this.call('/wallet/address', ['coin', coin]);
  }
  async tryWithdraw(coin: string) {
    return await this.call('/wallet/try_withdraw', ['coin', coin]);
  }
  async withdraw(address: string, coin: string, amount: number, token: string) {
    return await this.call('/wallet/withdraw',
      [
        'address', address,
        'coin', coin,
        'amount', amount,
        "token", token
      ]
    );
  }
  async fetchBalances() {
    return await this.call('/wallet/balance', []);
  }
  async fetchDepositHistory() {
    return await this.call('/wallet/deposit_history', []);
  }
  async fetchWithdrawHistory() {
    return await this.call('/wallet/withdraw_history', []);
  }
  async fetchCoins() {
    try {
      return await this.httpClient.get(environment.baseUrl + '/coins');
    } catch (e) {
      if (e.status === 0) {
        this.logoutInternal();
      }
    }
  }
  async fetchMarkets() {
    try {
      return await this.httpClient.get(environment.baseUrl + '/markets');
    } catch (e) {
      if (e.status === 0) {
        this.logoutInternal();
      }
    }
  }

  async fetchMarketPrices() {
    try {
      return await this.httpClient.get(environment.baseUrl + '/market_prices');
    } catch (e) {
      if (e.status === 0) {
        this.logoutInternal();
      }
    }
  }

  // ----------------------------------------
  // Orders
  // ----------------------------------------
  async makeOrder(pairStr: string, type: OrderType, price: any, amount: any) {
    return this.call('/order/make', ['pair', pairStr, 'type', type, 'price', price, 'amount', amount]);
  }

  async cancelOrder(pairStr: string, orderId: string, type: OrderType) {
    return this.call('/order/cancel', ['pair', pairStr, 'orderId', orderId, 'type', type]);
  }

  async fetchAllOpenOrders() {
    return await this.call('/order/open', []);
  }

  async fetchOpenOrders(pairStr: string) {
    return await this.call('/order/open/' + pairStr, []);
  }

  async fetchAllDealtOrders() {
    return await this.call('/order/dealt', [])
  }

  async fetchDealtOrders(pairStr: string, type: "sell" | "buy" | '' = '', page: number = 1, limit: number = 50) {
    return await this.call('/order/dealt/' + pairStr, ['type', type, 'page', page, 'limit', limit]);
  }

  // ----------------------------------------
  // Referral Commissions
  // ----------------------------------------
  async fetchReferralInfo() {
    return await this.call('/referral/info', []);
  }

  async fetchInvitations() {
    return await this.call('/referral/invitations', []);
  }

  async fetchCommissions() {
    return await this.call('/referral/commissions', []);
  }

  // ----------------------------------------
  // KYC
  // ----------------------------------------
  async kycParameters() {
    return await this.call('/kyc/parameters', []);
  }

  async kycStatus() {
    return await this.call('/kyc/status', []);
  }

  // ----------------------------------------
  // Financial Products
  // ----------------------------------------
  async transferToexchange(coin: string, amount: string) {
    return await this.call('/wallet/transfer_toexchange', ['coin', coin, 'amount', amount]);
  }

  async transferTofinance(coin: string, amount: string) {
    return await this.call('/wallet/transfer_tofinance', ['coin', coin, 'amount', amount]);
  }

  async unlockInterest(id: string, amount: string) {
    return await this.call('/financing/unlock_interest', ['purchaseId', id, 'amount', amount]);
  }

  async fetchUnlockInterestHistories(id: string) {
    return await this.call('/financing/try_unlock_interest', ['id', id]);
  }

  async fetchFinanceCoins() {
    return await this.call('/financing/coins', []);
  }

  async fetchFinancingBalances(coin: string) {
    return await this.call('/financing/balance', ['coin', coin]);
  }

  async fetchFinancingYesterdayProfits(coin: string) {
    return await this.call('/financing/yesterday_profit', ['coin', coin]);
  }

  async fetchTransferHistories(coin: string) {
    return await this.call('/wallet/transfer_history', ['coin', coin]);
  }

  async fetchAllProducts() {
    return await this.call('/financing/products', []);
  }

  async fetchProductDetails(id: string) {
    return await this.call('/financing/product/' + id, []);
  }

  async fetchBasicInterest(id: string) {
    return await this.call('/financing/basic_interest/' + id, []);
  }

  async fetchBonusProfitsByCoin() {
    return await this.call('/financing/bonus_profits/coin', []);
  }

  async fetchBonusProfitsByUser() {
    return await this.call('/financing/bonus_profits/user', []);
  }

  async fetchActivePurchases() {
    return await this.call('/financing/active_purchases', []);
  }

  async fetchActivePurchaseDetails(id: string) {
    return await this.call('/financing/active_purchase/' + id, []);
  }

  async fetchCompletePurchases() {
    return await this.call('/financing/complete_purchases', []);
  }

  async fetchCompletePurchaseDetails(id: string) {
    return await this.call('/financing/complete_purchase/' + id, []);
  }

  async financingProductPurchase(id: string, amount: string) {
    return await this.call('/financing/purchase', ['id', id, 'amount', amount]);
  }

  async financingProductCancel(id: string) {
    return await this.call('/financing/cancel', ['id', id]);
  }

  async fetchBonusProfitHistories(page: number = 1) {
    return await this.call('/financing/bonus_profit_histories', ['page', page]);
  }

  async fetchBonusProfitDetail(page: number, coin: string, createdAt: number) {
    return await this.call('/financing/bonus_profits_detail', ['page', page, 'coin', coin, 'createdAt', createdAt]);
  }

  // ----------------------------------------------------------------------
  // Events
  // ----------------------------------------------------------------------
  async fetchLottos() {
    return await this.call('/events/lottos', []);
  }

  async fetchLottoDetail(catalogId: string, lottoId: string) {
    return await this.call('/events/lotto_detail', ['catalogId', catalogId, 'lottoId', lottoId]);
  }

  async fetchLottoResults() {
    return await this.call('/events/lotto_results', []);
  }

  async fetchLottoResult(catalogId: string, lottoId: string) {
    return await this.call('/events/lotto_result', ['catalogId', catalogId, 'lottoId', lottoId]);
  }

  async executeLotto(catalogId: string, lottoId: string) {
    return await this.call('/events/lotto_exec', ['catalogId', catalogId, 'lottoId', lottoId]);
  }

  async fetchEvents() {
    return await this.call('/events/', []);
  }

  async fetchEventDetail(catalogId: string, eventId: string) {
    return await this.call('/events/detail', ['catalogId', catalogId, 'eventId', eventId]);
  }

  async getMaxPurchasable(catalogId: string, eventId: string) {
    return await this.call('/events/max_purchasable', ['catalogId', catalogId, 'eventId', eventId]);
  }

  async participateInEvent(catalogId: string, eventId: string, amount: number) {
    return await this.call('/events/participate', ['catalogId', catalogId, 'eventId', eventId, 'amount', amount]);
  }

  async fetchEventParticipations() {
    return await this.call('/events/participations', []);
  }

  async fetchEventParticipationDetail(catalogId: string, participationId: string) {
    return await this.call('/events/participation', ['catalogId', catalogId, 'participationId', participationId]);
  }

  async fetchEventAirDrops(pageNum: number = 1) {
    return await this.call('/events/air_drops', ['page', pageNum]);
  }

  async fetchEventCommissionAirDrops(pageNum: number = 1) {
    return await this.call('/events/commission_air_drops', ['page', pageNum]);
  }

  async fetchYesterdayCommissionAirDrops() {
    return await this.call('/events/yesterday_commission_air_drops', []);
  }

  async fetchYesterdayAirDrops() {
    return await this.call('/events/yesterday_air_drops', []);
  }

  async fetchDailyCommissionsAirDrops(pageNum: number = 1) {
    return await this.call('/events/daily_commission_air_drops', ['page', pageNum]);
  }

  async fetchCommissionAirDropDetails(timestamp: number) {
    return await this.call('/events/commission_air_drop_details', ['timestamp', timestamp])
  }

  async fetchEventDailyRanking(catalogId: string, eventId: string) {
    return await this.call('/events/daily_ranking', ['catalogId', catalogId, 'eventId', eventId]);
  }

  // ----------------------------------------
  // Internal
  // ----------------------------------------
  async call(endpoint: string, args: any[]) {
    let res = undefined;
    try {
      res = await this.httpClient.post(environment.baseUrl + endpoint, args);
    } catch (e) {
      this.logoutInternal();
      throw e;
    }
    if (res.errors) {
      let error = res.errors[0];
      throw new Exception(error.code, error.msg);
    }
    return res;
  }

  private makeParamStr(...args: any[]): string {
    args.unshift(`${new Date().getTime()}`);
    return args.join('\0') + '\0';
  }
}
