import { AuthentificationService } from './../services/authentification.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    error ='';
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthentificationService,
    private router: Router,
    private route: ActivatedRoute,
    )
  {
    if (this.authService.UserObjValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      emailOrUsername: ['', Validators.required],
      password: ['', Validators.required]
  });

  // tslint:disable-next-line:no-string-literal
  this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }
      // convenience getter for easy access to form fields
      get f() { return this.loginForm.controls; }

      onSubmit() {
          this.submitted = true;

          // stop here if form is invalid
          if (this.loginForm.invalid) {
              return;
          }

          this.loading = true;
          this.authService.login(this.f.emailOrUsername.value, this.f.password.value)
              .pipe(first())
              .subscribe(
                  data => {
                      this.router.navigate([this.returnUrl]);
                  },
                  error => {
                    this.error=error.error.errors[0].msg
                      this.loading = false;
                  });
      }

}
