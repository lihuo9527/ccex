import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ApiClientService } from '../../../../services/api-client.service';
import { ActivatedRoute } from '@angular/router';
import { LocalizationService } from 'src/app/services/localization.service';
import { getUrlKey, getBrowserDevice } from 'src/app/modules/share/methods/methods';
import { AccountMessages } from 'src/app/modules/share/messages/messages';
import { MessagePopupType, MessagePopup } from 'src/app/modules/share/message-popup/message-popup';
import { environment } from 'src/environments/environment.prod';
@Component({
  selector: 'ccex-signup-by-phone',
  templateUrl: './signup-by-phone.component.html',
  styleUrls: ['./signup-by-phone.component.less']
})
export class SignupByPhoneComponent implements OnInit {
  validateForm: FormGroup;
  private captchaObj: any = undefined;
  phoneNum: string = '';

  isOver = false;

  countdown = 0;
  async sendVerifyCode() {
    if (this.countdown > 0 || this.isLoading()) return;
    let phoneNum = `${this.validateForm.controls.countryCode.value}${this.validateForm.controls.phone.value}`;
    if (!/^\d+$/.test(phoneNum)) {
      let msgObj = this.localize.currentLanguage.id === 'zh_CN' ? { title: "错误：", text: `手机号格式错误: (${this.validateForm.controls.countryCode.value})${this.validateForm.controls.phone.value}`, confirm: "确认" } : { title: "Error：", text: `Invalid phone number format: (${this.validateForm.controls.countryCode.value})${this.validateForm.controls.phone.value}`, confirm: "Confirm" };
      MessagePopup.show(MessagePopupType.WARNING, msgObj.title, msgObj.text, msgObj.confirm);
      setTimeout(() => MessagePopup.hide(), 5000);
      return;
    }
    try {
      this.countdown = 60;
      let interval = setInterval(() => {
        this.countdown--;
        if (this.countdown === 0) clearInterval(interval);
      }, 1000);
      await this.apiClient.sendSmsVerifyCode(
        this.validateForm.controls.countryCode.value,
        this.validateForm.controls.phone.value,
      );
    } catch (e) {
      console.error(e);
      this.showErrorPopup(e.code);
    }
  }

  submitForm(): void {
    if (this.isOver) return;
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    if (this.validateForm.invalid) return;
    this.captchaObj.verify();
  }

  updateConfirmValidator(): void {
    Promise.resolve()
      .then(() => this.validateForm.controls.checkPassword.updateValueAndValidity());
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
  }

  get ReferralId() {
    return getUrlKey("ref") || sessionStorage.getItem('ref');
  }

  constructor(
    public localize: LocalizationService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private apiClient: ApiClientService,
  ) { }

  ngOnInit() {
    let device = getBrowserDevice();
    if (device.isMobile || device.isWechat) return window.location.href = `${environment.mobileSiteUrl}${!this.ReferralId ? '/account/signup_phone' : `/account/signup_phone?ref=${this.ReferralId}`}`;

    this.phoneNum = this.route.snapshot.paramMap.get('phoneNum');
    if (this.phoneNum) {
      this.isOver = true;
      return;
    }

    this.validateForm = this.formBuilder.group({
      countryCode: ['0086', [Validators.required, Validators.pattern(/^\d+$/)]],
      phone: [undefined, [Validators.required, Validators.pattern(/^\d+$/)]],
      code: [undefined, [Validators.required, Validators.pattern(/^\d\d\d\d\d\d$/)]],
      password: [ undefined, [ Validators.required, Validators.minLength(6) ] ],
      checkPassword: [ undefined, [ Validators.required, this.confirmationValidator ] ],
      agree: [ true, [ Validators.requiredTrue ] ],
      referralId: [ this.ReferralId, [ undefined || Validators.pattern(/^[0-9]{9}$/) ] ]
    });

    this.apiClient.getCaptchaObject(validGt => this.signup(validGt))
      .then(captchaObj => this.captchaObj = captchaObj)
      .catch(e => console.error(e));

    if (this.ReferralId) sessionStorage.setItem('ref', this.ReferralId);
  }

  private signup(validGt) {
    this.apiClient.signupByPhone(
      this.validateForm.controls.countryCode.value,
      this.validateForm.controls.phone.value,
      this.validateForm.controls.password.value,
      this.validateForm.controls.code.value,
      validGt,
      this.validateForm.controls.referralId.value || ''
    )
    .then(res => {
      this.isOver = true;
      this.phoneNum = this.validateForm.controls.countryCode.value + this.validateForm.controls.phone.value;
      window.location.href = '/account/signup_phone;phoneNum=' + encodeURIComponent(this.phoneNum);
    })
    .catch(e => {
        this.showErrorPopup(e.code);
      });
  }

  isLoading() {
    return !this.captchaObj;
  }

  showErrorPopup(code: number) {
    let msgObj = new AccountMessages(this.localize.currentLanguage.id).getMessage(code);
    MessagePopup.show(MessagePopupType.WARNING, msgObj.title, msgObj.text, msgObj.confirm);
    setTimeout(() => MessagePopup.hide(), 5000);
  }

}
