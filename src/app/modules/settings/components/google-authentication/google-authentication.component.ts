import { Component, OnInit } from '@angular/core';
import { ApiClientService } from 'src/app/services/api-client.service';
import { NzModalService } from 'ng-zorro-antd';
import { LocalizationService } from 'src/app/services/localization.service';

@Component({
  selector: 'ccex-google-authentication',
  templateUrl: './google-authentication.component.html',
  styleUrls: ['./google-authentication.component.less']
})
export class GoogleAuthenticationComponent implements OnInit {
  isVisible: boolean = true;
  currentStep: number = 0;
  bindStatus: boolean = false;
  isLoading: boolean = false;
  verifyCode: string = null;
  isInvalid: boolean = false;
  twoStepCode: string = null;
  countdown: number = 0;
  twoStepObj: any = null;
  constructor(public apiClient: ApiClientService, private modalService: NzModalService, public localize: LocalizationService) { }

  ngOnInit() {
    this.sendVerifyCode();
  }

  validateValue(code): void {
    this.isInvalid = !new RegExp("^[0-9]{6}$").test(code);
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
      await this.apiClient.resetTwoStep();
    } catch (e) {
      console.error(e);
    }
  }

  async submit() {
    if (this.isInvalid || !this.verifyCode && this.currentStep === 0 || !this.twoStepCode && this.currentStep === 1) {
      this.isInvalid = true;
      return;
    }
    this.isLoading = true;
    try {
      if (this.currentStep === 0) {
        this.twoStepObj = await this.apiClient.TwoStepVerifyCode(this.verifyCode);
      } else {
        await this.apiClient.enableTwoStep(this.twoStepCode);
        this.bindStatus = true;
      }
      this.currentStep += 1;
    } catch (e) {
      let msgObj = this.localize.currentLanguage.id === "zh_CN" ? { title: "错误", text: "输入的验证码有误,请重新输入!" } : { title: "Error", text: "Wrong input code, please input again!" };
      let modalRef = this.modalService.warning({
        nzTitle: msgObj.title,
        nzContent: msgObj.text
      });
      setTimeout(() => modalRef.close(), 5000);
      console.error(e);
    }
    this.isLoading = false;
  }

  close(){
    window.history.go(-1);
  }
}
