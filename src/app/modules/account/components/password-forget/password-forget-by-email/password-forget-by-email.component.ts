import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiClientService } from 'src/app/services/api-client.service';
import { NzModalService } from 'ng-zorro-antd';
import { AccountMessages } from 'src/app/modules/share/messages/messages';
import { LocalizationService } from 'src/app/services/localization.service';
@Component({
  selector: 'ccex-password-forget-by-email',
  templateUrl: './password-forget-by-email.component.html',
  styleUrls: ['./password-forget-by-email.component.less']
})
export class PasswordForgetByEmailComponent implements OnInit {
  currentStep: number = 0;
  validateEmailForm: FormGroup;
  isLoading: boolean = false;
  status: boolean = false;
  private resetObj = { type: "email", email: null };
  constructor(
    private formBuilder: FormBuilder,
    private apiClient: ApiClientService,
    private modalService: NzModalService,
    private localize: LocalizationService
    ) { }

  ngOnInit() {
    this.validateEmailForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]]
    });
  }

  submitEmail(): void {
    for (const i in this.validateEmailForm.controls) {
      this.validateEmailForm.controls[i].markAsDirty();
      this.validateEmailForm.controls[i].updateValueAndValidity();
    }
    if (this.validateEmailForm.invalid) return;
    this.sendVerifyCode();
  }

  async sendVerifyCode() {
    this.isLoading = true;
    try {
      await this.apiClient.tryResetPasswordByEmail(this.validateEmailForm.value.email);
      this.resetObj.email = this.validateEmailForm.value.email;
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
