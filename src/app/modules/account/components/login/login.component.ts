import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiClientService } from 'src/app/services/api-client.service';
import { ErrorType } from 'src/app/models/error';
import { GoogleVaildate } from 'src/app/modules/share/google-validate/google-validate.component';
import { LocalizationService } from 'src/app/services/localization.service';
import { AccountMessages, ACCOUNT } from 'src/app/modules/share/messages/messages';
import { MessagePopupType, MessagePopup } from 'src/app/modules/share/message-popup/message-popup';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'ccex-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
  validateForm: FormGroup;
  isGoogleValidateLoading: boolean = false;
  returnUrl: string;
  private captchaObj: any = undefined;
  private isOver: boolean = false;
  private googleVaildate = new GoogleVaildate();
  constructor(
    private formBuilder: FormBuilder,
    private apiClient: ApiClientService,
    private localize: LocalizationService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.paramMap.get("returnUrl");
    this.validateForm = this.formBuilder.group({
      email: [undefined, [Validators.required, Validators.email]],
      password: [undefined, [Validators.required, Validators.minLength(6)]]
    });

    this.apiClient.getCaptchaObject(validGt => this.login(validGt))
      .then(captchaObj => this.captchaObj = captchaObj)
      .catch(e => console.error(e));
  }

  async submitForm() {
    if (this.isOver) return;
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.invalid) return;
    this.captchaObj.verify();
  }

  private login(validGt) {
    this.apiClient.login(
      this.validateForm.controls.email.value,
      this.validateForm.controls.password.value,
      validGt
    )
      .then(res => {
        this.isOver = true;
        window.location.href = this.returnUrl ? this.returnUrl : '/wallet';
      })
      .catch(e => {
        if (e.code === ErrorType.TWO_STEP_FAILURE) {
          this.googleVaildate.show();
          return;
        }
        this.showErrorPopup(ACCOUNT.LOGIN_FAILED);
        console.error(e);
      });
  }

  isLoading() {
    return !this.captchaObj;
  }

  async onGoogleValidate(event: any) {
    this.isGoogleValidateLoading = true;
    try {
      await this.apiClient.login_ga(this.validateForm.controls.email.value, this.validateForm.controls.password.value, event.code);
      this.isOver = true;
      window.location.href = this.returnUrl ? this.returnUrl : '/wallet';
    } catch (e) {
      this.showErrorPopup(ACCOUNT.GOOGLE_VALIDATE_FAILED);
      console.error(e);
    }
    this.isGoogleValidateLoading = false;
    this.googleVaildate.hidden();
  }

  showErrorPopup(codeType: number) {
    let msgObj = new AccountMessages(this.localize.currentLanguage.id).getMessage(codeType);
    MessagePopup.show(MessagePopupType.WARNING, msgObj.title, msgObj.text, msgObj.confirm);
    setTimeout(() => MessagePopup.hide(), 5000);
  }

}
