import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ccex-google-validate',
  templateUrl: './google-validate.component.html',
  styleUrls: ['./google-validate.component.less']
})
export class GoogleValidateComponent implements OnInit {
  @Input() isLoading: boolean;
  @Output() validateEvent: EventEmitter<any> = new EventEmitter<any>();
  isInvalid: boolean = false;
  verifyCode: string;
  constructor() { }

  ngOnInit() {
  }

  validateValue(code) {
    this.isInvalid = !new RegExp("^[0-9]{6}$").test(code);
  }

  sendVerifyCode() {
    if (this.isInvalid) return;
    this.validateEvent.emit({ code: this.verifyCode });
    this.verifyCode = null;

  }

  close() {
    this.isLoading = false;
    this.verifyCode = null;
    new GoogleVaildate().hidden();
  }

}

export class GoogleVaildate {
  show() {
    document.getElementById("googleValidate").style.display = "block";
  }
  
  hidden() {
    document.getElementById("googleValidate").style.display = "none";
  }
}
