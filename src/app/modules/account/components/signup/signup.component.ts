import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ApiClientService } from '../../../../services/api-client.service';
import { ActivatedRoute } from '@angular/router';
import { getUrlKey, getBrowserDevice } from 'src/app/modules/share/methods/methods';
import { LocalizationService } from 'src/app/services/localization.service';
import { AccountMessages } from 'src/app/modules/share/messages/messages';
import { MessagePopupType, MessagePopup } from 'src/app/modules/share/message-popup/message-popup';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'ccex-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.less']
})
export class SignupComponent implements OnInit {
  validateForm: FormGroup;
  private captchaObj: any = undefined;
  email: string = '';

  isOver = false;

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
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private apiClient: ApiClientService,
    private localize: LocalizationService,
  ) { }

  ngOnInit() {
    let device = getBrowserDevice();
    if (device.isMobile || device.isWechat) return window.location.href = `${environment.mobileSiteUrl}${!this.ReferralId ? '/account/signup' : `/account/signup?ref=${this.ReferralId}`}`;

    this.email = this.route.snapshot.paramMap.get('email');
    if (this.email) {
      this.isOver = true;
      return;
    }
    this.validateForm = this.formBuilder.group({
      email            : [ undefined, [ Validators.required, Validators.email ] ],
      password         : [ undefined, [ Validators.required, Validators.minLength(6) ] ],
      checkPassword    : [ undefined, [ Validators.required, this.confirmationValidator ] ],
      agree            : [ true, [ Validators.requiredTrue ] ],
      referralId       : [ this.ReferralId, [ undefined || Validators.pattern(/^[0-9]{9}$/) ] ]
    });
    this.apiClient.getCaptchaObject(validGt => this.signup(validGt))
      .then(captchaObj => this.captchaObj = captchaObj)
      .catch(e => console.error(e));

    if (this.ReferralId) sessionStorage.setItem('ref', this.ReferralId);
  }

  private signup(validGt) {
    this.apiClient.signup(
      this.validateForm.controls.email.value,
      this.validateForm.controls.password.value,
      validGt,
      this.validateForm.controls.referralId.value || ''
    )
    .then(res => {
      this.isOver = true;
      this.email = this.validateForm.controls.email.value;
      window.location.href = '/account/signup;email=' + encodeURIComponent(this.email);
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
