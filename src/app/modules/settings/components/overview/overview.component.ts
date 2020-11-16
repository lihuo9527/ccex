import { Component, OnInit } from '@angular/core';
import { ApiClientService } from '../../../../services/api-client.service';
import { DatetimeFormater } from '../../../../helpers/datetime-formater';
import { ErrorType } from 'src/app/models/error';
import { Router } from '@angular/router';

@Component({
  selector: 'ccex-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.less']
})
export class OverviewComponent implements OnInit {
  email: string = '- -';
  vipLevel: number = 0;
  lastLogin: { datetime: string, ip: string } = { datetime: '- - -', ip: '- - -' };
  recentLogins: { datetime: string, ip: string }[] = [];
  isLoading = false;

  apiSettings = [];

  profileAttributes = [
    {
      id: OPERATIONS.RESET_PASSWORD,
      name: "USER.PASSWORD",
      value: '**********',
      operation: 'COMMON.RESET',
      disabled: false
    },
    {
      id: OPERATIONS.EDIT_KYC,
      name: "USER.KYC",
      value: '',
      operation: 'COMMON.MODIFY',
      disabled: true
    },
    {
      name: "USER.24H_WITHDRAW_LIMIT",
      value: '500.0 BTC'
    }
  ];
  securities = [
    {
      id: OPERATIONS.EDIT_GOOGLE_TWO_STEP_AUTH,
      name: "USER.GOOGLE_TWO_STEP",
      value: 'COMMON.DISABLED',
      operation: 'COMMON.MODIFY',
      disabled: false,
      routerUrl: '/settings/google-authentication',
    },
    {
      id: OPERATIONS.EDIT_SMS_AUTH,
      name: "USER.SMS_VERIFY",
      value: 'COMMON.DISABLED',
      operation: 'COMMON.MODIFY',
      disabled: true,
      routerUrl: '/settings/bind_phone',
    }
  ];

  isKycVisible = false;
  kycScriptObj = undefined;
  onOperation(id: OPERATIONS) {
    switch (id) {
      case OPERATIONS.RESET_PASSWORD:
        this.router.navigate(["/settings/password-reset"]);
        break;
      case OPERATIONS.EDIT_KYC:
        this.apiClient.kycParameters()
          .then(params => {
            if (!this.kycScriptObj) {
              this.kycScriptObj = document.createElement('script');
              this.kycScriptObj.src = 'https://cdn.blockpass.org/widget/scripts/release/1.0.4/embeded.prod.js?t=20190524';
              this.kycScriptObj.async = true;
              document.body.appendChild(this.kycScriptObj);
            }
            //@ts-ignore
            window.bpWidget = params;
            this.isKycVisible = true;
          })
          .catch(e => console.error(e));
        break;
      default:
        throw new Error('unknow operation: ' + id);
    }
  }

  constructor(private router: Router, private apiClient: ApiClientService) { }

  ngOnInit() {
    this.fetchProfile();
    this.fetchKyc();
  }

  private async fetchKyc() {
    try {
      let status = (await this.apiClient.kycStatus()).status;
      let kyc = this.profileAttributes.find(attr => attr.id === OPERATIONS.EDIT_KYC);
      switch (status) {
        case 'inreview':
          kyc.disabled = true;
          kyc.value = 'KYC.IN_REVIEW';
          break;
        case 'waiting':
          kyc.disabled = true;
          kyc.value = 'KYC.WAITING';
          break;
        case 'approved':
          kyc.value = 'KYC.APPROVED';
          kyc.disabled = true;
          break;
        default:
          return;
      }
    } catch (e) {
      let kyc = this.profileAttributes.find(attr => attr.id === OPERATIONS.EDIT_KYC);
      kyc.disabled = false;
      kyc.value = 'COMMON.DISABLED';
    }
  }

  private async fetchProfile() {
    this.isLoading = true;
    try {
      let account = await this.apiClient.profile();
      this.email = account.email;
      this.vipLevel = account.vipLevel;
      for (let record of account.recentLogins) {
        this.recentLogins.push({
          datetime: DatetimeFormater.toFullDateTime(parseInt(record.createdAt, 10)),
          ip: record.ip.split(',')[0]
        });
      }
      this.lastLogin = this.recentLogins[0];
      for (let item of this.securities) {
        if (item.id === OPERATIONS.EDIT_GOOGLE_TWO_STEP_AUTH && account.isTwoStepEnabled) {
          item.value = 'COMMON.ENABLED';
          item.routerUrl = '/settings/google-authentication/invalidation';
        }
        if (item.id === OPERATIONS.EDIT_SMS_AUTH) {
          item.value = account.isSmsVerified ? 'COMMON.ENABLED' : 'COMMON.DISABLED';
          item.disabled = account.isSmsVerified;
        }
      }
    } catch (e) {
      console.error(e);
      if (e.code === ErrorType.UNAUTHENTICATED) {
        this.apiClient.logout();
      }
    }
    this.isLoading = false;
  }

}

enum OPERATIONS {
  RESET_PASSWORD = 1,
  EDIT_KYC = 2,
  EDIT_GOOGLE_TWO_STEP_AUTH = 3,
  EDIT_SMS_AUTH = 4
};