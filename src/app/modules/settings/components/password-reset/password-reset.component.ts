import { Component, OnInit } from '@angular/core';
import { ApiClientService } from 'src/app/services/api-client.service';
import { Router } from '@angular/router';
@Component({
  selector: 'ccex-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.less']
})
export class PasswordResetComponent implements OnInit {
  isVisible = true;
  currentStep = 0;
  status = false;
  public resetObj = new RegExp(/^\d+$/).test(this.apiClient.currentUser) ? { type: "phone", phone: undefined, countryCode: undefined, isLogin: true } : { type: "email", email: undefined, isLogin: true };
  constructor(private apiClient: ApiClientService,private router: Router ) { }

  ngOnInit() {}

  submitForm(event: any) {
    this.status = event.status;
    this.currentStep += 1;
  }

  close() {
    this.router.navigate(['/settings/overview'])
  }
}
