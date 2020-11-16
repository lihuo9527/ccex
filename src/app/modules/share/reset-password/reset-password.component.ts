import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ApiClientService } from 'src/app/services/api-client.service';

@Component({
  selector: 'ccex-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.less']
})
export class ResetPasswordComponent implements OnInit {
  @Input() private resetObj: any;
  @Output() private resetEvent: EventEmitter<any> = new EventEmitter<any>();
  validateForm: FormGroup;
  isLoading: boolean = false;
  countdown: number = 0;
  private captchaObj;
  constructor(private formBuilder: FormBuilder, private apiClient: ApiClientService) { }
  ngOnInit() {
    this.validateForm = this.formBuilder.group({
      password: [null, [Validators.required, Validators.minLength(6)]],
      checkPassword: [undefined, [Validators.required, this.confirmationValidator]],
      code: [null, [Validators.required, Validators.pattern(/^\d\d\d\d\d\d$/)]]
    });
    this.apiClient.getCaptchaObject(validGt => this.resetPassword(validGt)).then(
      captchaObj => this.captchaObj = captchaObj
    ).catch(err => console.log(err));
    if (this.resetObj.isLogin) this.sendVerifyCode();
  }

  async sendVerifyCode() {
    if (this.countdown > 0) return;
    try {
      this.countdown = 60;
      let interval = setInterval(() => {
        this.countdown--;
        if (this.countdown === 0) {
          clearInterval(interval);
        }
      }, 1000);
      switch(this.resetObj.type){
        case "email":
          await this.apiClient.tryResetPasswordByEmail(this.resetObj.email);
          break;
        case "phone":
        console.log(this.resetObj);
          await this.apiClient.tryResetPasswordByPhone(this.resetObj.countryCode, this.resetObj.phone);
          break;
      }
    } catch (e) {
      console.error(e);
    }
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.value.password) {
      return { confirm: true, error: true };
    }
  }
  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.invalid) return;
    this.isLoading = true;
    if (this.resetObj.type === "email" && !this.resetObj.email || this.resetObj.type === "phone" && !this.resetObj.countryCode && !this.resetObj.phone) {
       this.modifyPassword();
       return;
    }
    this.captchaObj.verify();
  }

  async modifyPassword() {
    try {
      if (this.resetObj.type === "email") {
        await this.apiClient.modifyPasswordByEmail(this.validateForm.value.password, this.validateForm.value.code);
      } else {
        await this.apiClient.modifyPasswordByPhone(this.validateForm.value.password, this.validateForm.value.code)
      }
      this.resetEvent.emit({ status: true });
    } catch (e) {
      console.error(e);
      this.resetEvent.emit({ status: false });
    }
    this.isLoading = false;
  }

  async resetPassword(validGt) {
    try {
      if (this.resetObj.type === "email") {
        await this.apiClient.resetPasswordByEmail(this.resetObj.email, this.validateForm.value.password, this.validateForm.value.code, validGt);
      } else {
        await this.apiClient.resetPasswordByPhone(this.resetObj.countryCode, this.resetObj.phone, this.validateForm.value.password, this.validateForm.value.code, validGt);
      }
      this.resetEvent.emit({ status: true });
    } catch (e) {
      console.error(e);
      this.resetEvent.emit({ status: false });
    }
    this.isLoading = false;
  }
}
