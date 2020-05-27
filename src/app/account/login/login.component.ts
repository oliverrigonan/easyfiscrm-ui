import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './login.service';
import { LoginModel } from './login.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private loginService: LoginService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  public loginSub: any;
  public loginModel: LoginModel = {
    UserName: "",
    Password: ""
  };

  public login(): void {
    let btnLogin: Element = document.getElementById("btnLogin");
    btnLogin.setAttribute("disabled", "disabled");
    btnLogin.setAttribute("value", "Signing in...");

    let inpUsername: Element = document.getElementById("inpUsername");
    inpUsername.setAttribute("disabled", "disabled");

    let inpPassword: Element = document.getElementById("inpPassword");
    inpPassword.setAttribute("disabled", "disabled");

    if ((<HTMLInputElement>inpUsername).value === "" || (<HTMLInputElement>inpPassword).value === "") {
      this.toastr.error('Username or Password is empty. Please do not leave blanks.', 'Error');

      btnLogin.removeAttribute("disabled");
      btnLogin.setAttribute("value", "Sign in");
      inpUsername.removeAttribute("disabled");
      inpPassword.removeAttribute("disabled");
    } else {
      this.loginService.login(this.loginModel.UserName, this.loginModel.Password);
      this.loginSub = this.loginService.loginObservable.subscribe(
        data => {
          if (data[0]) {
            setTimeout(() => {
              this.router.navigate(['/software']);
              this.toastr.success(data[1], 'Success');
            }, 100);
          } else {
            this.toastr.error(data[1], 'Error');
            btnLogin.removeAttribute("disabled");
            btnLogin.setAttribute("value", "Sign in");
            inpUsername.removeAttribute("disabled");
            inpPassword.removeAttribute("disabled");
          }

          if (this.loginSub != null) this.loginSub.unsubscribe();
        }
      );
    }
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.loginSub != null) this.loginSub.unsubscribe();
  }
}
