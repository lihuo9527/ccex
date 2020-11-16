import { Component, OnInit } from '@angular/core';
import { ApiClientService } from 'src/app/services/api-client.service';

@Component({
  selector: 'ccex-google-authentiction-invalidation',
  templateUrl: './google-authentiction-invalidation.component.html',
  styleUrls: ['./google-authentiction-invalidation.component.less']
})
export class GoogleAuthentictionInvalidationComponent implements OnInit {
  isVisible: boolean = true;
  currentStep: number = 0;
  twoStepToken: string = null;
  isInvalid: boolean = false;
  disable: boolean = false;
  isLoading: boolean = false;

  constructor(private apiClient: ApiClientService) { }

  ngOnInit() {
  }

  validateValue(token): void {
    this.isInvalid = !new RegExp("^[0-9]{6}$").test(token);
  }

  async submit() {
    if (this.isInvalid || !this.twoStepToken && this.currentStep === 0) {
      this.isInvalid = true;
      return;
    }
    this.isLoading = true;
    try {
      await this.apiClient.disableTwoStep(this.twoStepToken);
      this.disable = true;
    } catch (e) {
      console.error(e);
    }
    this.currentStep += 1;
    this.isLoading = false;
  }

  close(){
    window.history.go(-1);
  }
}
