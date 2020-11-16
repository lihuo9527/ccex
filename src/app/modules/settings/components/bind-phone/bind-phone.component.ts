import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiClientService } from 'src/app/services/api-client.service';
import { ErrorType } from 'src/app/models/error';
import { NzMessageService } from 'ng-zorro-antd';
import { LocalizationService } from 'src/app/services/localization.service';
import { AccountMessages } from 'src/app/modules/share/messages/messages';
import { MessagePopupType, MessagePopup } from 'src/app/modules/share/message-popup/message-popup';
@Component({
  selector: 'ccex-bind-phone',
  templateUrl: './bind-phone.component.html',
  styleUrls: ['./bind-phone.component.less']
})
export class BindPhoneComponent implements OnInit {
  currentStep = 0;
  validatePhoneNumForm: FormGroup;
  validateCodeForm: FormGroup;
  isLoading = true;

  countdown = 60;

  constructor(
    public localize: LocalizationService,
    private router: Router,
    private formBuilder: FormBuilder,
    private messageService: NzMessageService,
    private apiClient: ApiClientService
  ) { }

  ngOnInit() {
    this.validatePhoneNumForm = this.formBuilder.group({
      countryCode: ['0086', [Validators.required, Validators.pattern(/^\d+$/)]],
      phone: [undefined, [Validators.required, Validators.pattern(/^\d+$/)]],
    });
    this.validateCodeForm = this.formBuilder.group({
      code: [undefined, [Validators.required, Validators.pattern(/^\d\d\d\d\d\d$/)]],
    });

    this.apiClient.profile()
    .then(account => {
      if (account.isSmsVerified) this.goBack();
      this.isLoading = false;
    })
    .catch(e => {
      if (e.code === ErrorType.UNAUTHENTICATED) {
        this.apiClient.logout();
      }
      this.showErrorPopup(e.code);
    });
  }

  async resendVerifyCode() {
    if (this.countdown > 0 || this.isLoading) return;
    let phoneNum = this.validatePhoneNumForm.controls.countryCode.value + this.validatePhoneNumForm.controls.phone.value;
    if (!/^\d+$/.test(phoneNum)) return;
    this.isLoading = true;
    try {
      this.countdown = 60;
      let interval = setInterval(() => {
        this.countdown--;
        if (this.countdown === 0) clearInterval(interval);
      }, 1000);
      await this.apiClient.sendSmsVerifyCode(
        this.validatePhoneNumForm.controls.countryCode.value,
        this.validatePhoneNumForm.controls.phone.value,
      );
    } catch (e) {
      this.showErrorPopup(e.code);
    }
    this.isLoading = false;
  }

  submitPhoneNum() {
    for (const i in this.validatePhoneNumForm.controls) {
      this.validatePhoneNumForm.controls[i].markAsDirty();
      this.validatePhoneNumForm.controls[i].updateValueAndValidity();
    }
    if (this.validatePhoneNumForm.invalid) return;

    this.isLoading = true;
    this.apiClient.sendSmsVerifyCode(
      this.validatePhoneNumForm.controls.countryCode.value,
      this.validatePhoneNumForm.controls.phone.value
    )
    .then(() => {
      this.isLoading = false;
      this.currentStep = 1;
      this.countdown = 60;
      let interval = setInterval(() => {
        this.countdown--;
        if (this.countdown === 0) clearInterval(interval);
      }, 1000);
    })
    .catch(e => {
      this.isLoading = false;
      this.showErrorPopup(e.code);
    });
  }

  submitCode() {
    for (const i in this.validateCodeForm.controls) {
      this.validateCodeForm.controls[i].markAsDirty();
      this.validateCodeForm.controls[i].updateValueAndValidity();
    }
    if (this.validateCodeForm.invalid) return;

    this.isLoading = true;
    this.apiClient.verifyPhone(
      this.validatePhoneNumForm.controls.countryCode.value,
      this.validatePhoneNumForm.controls.phone.value,
      this.validateCodeForm.controls.code.value
    )
    .then(() => {
      this.isLoading = false;
      this.currentStep = 2;
    })
    .catch(e => {
      this.isLoading = false;
      this.showErrorPopup(e.code);
    });
  }

  goBack() {
    this.router.navigate(['/settings/overview']);
  }

  showErrorPopup(code: number) {
    let msgObj = new AccountMessages(this.localize.currentLanguage.id).getMessage(code);
    MessagePopup.show(MessagePopupType.WARNING, msgObj.title, msgObj.text, msgObj.confirm);
    setTimeout(() => MessagePopup.hide(), 5000);
  }

}
