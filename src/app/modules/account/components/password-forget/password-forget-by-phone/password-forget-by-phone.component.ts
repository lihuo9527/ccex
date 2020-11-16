import { Component, OnInit } from '@angular/core';
import { LocalizationService } from 'src/app/services/localization.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiClientService } from 'src/app/services/api-client.service';
import { AccountMessages } from 'src/app/modules/share/messages/messages';
import { NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'ccex-password-forget-by-phone',
  templateUrl: './password-forget-by-phone.component.html',
  styleUrls: ['./password-forget-by-phone.component.less']
})
export class PasswordForgetByPhoneComponent implements OnInit {
  currentStep: number = 0;
  validatePhoneForm: FormGroup;
  isLoading: boolean = false;
  status: boolean = false;
  private resetObj = { type: "phone", phone: null, countryCode: null };
  constructor(
    public localize: LocalizationService,
    private formBuilder: FormBuilder,
    private apiClient: ApiClientService,
    private modalService: NzModalService
    ) { }

  ngOnInit() {
    this.validatePhoneForm = this.formBuilder.group({
      countryCode: ['0086', [Validators.required, Validators.pattern(/^\d+$/)]],
      phone: [undefined, [Validators.required, Validators.pattern(/^\d+$/)]]
    });
  }

  submitPhone(): void {
    for (const i in this.validatePhoneForm.controls) {
      this.validatePhoneForm.controls[i].markAsDirty();
      this.validatePhoneForm.controls[i].updateValueAndValidity();
    }
    if (this.validatePhoneForm.invalid) return;
    this.sendVerifyCode();
  }

  async sendVerifyCode() {
    this.isLoading = true;
    try {
      await this.apiClient.tryResetPasswordByPhone(this.validatePhoneForm.value.countryCode, this.validatePhoneForm.value.phone);
      this.resetObj.phone = this.validatePhoneForm.value.phone;
      this.resetObj.countryCode = this.validatePhoneForm.value.countryCode;
      this.currentStep = 1;
    } catch (e) {
      let msgObj = new AccountMessages(this.localize.currentLanguage.id).getMessage(e.code);
      let modalRef = this.modalService.warning({ nzTitle: msgObj.title, nzContent: msgObj.text });
      setTimeout(() => modalRef.close(), 5000);
      console.error(e);
    }
    this.isLoading = false;
  }

  submitForm(obj: any): void {
    this.status = obj.status;
    this.currentStep = 2;
  }
}
