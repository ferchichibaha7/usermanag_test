import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthentificationService } from '@app/services/authentification.service';
import { UserServiceService } from '@app/services/user-service.service';
import { first, map } from 'rxjs/operators';

@Component({
  selector: 'app-add-edit-user',
  templateUrl: './add-edit-user.component.html',
  styleUrls: ['./add-edit-user.component.scss'],
})
export class AddEditUserComponent implements OnInit {
  myform: FormGroup;
  loading = false;
  submitted = false;
  id: string;
  isAddMode: boolean;
  returnUrl: string;
  error = '';
  errorslist = []
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthentificationService,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserServiceService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

    this.myform = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required,Validators.pattern(this.validPattern)]],
      firstname: ['',  [Validators.required]],
      lastname: ['',  [Validators.required]],
      isActive: [true,  [Validators.required]],
      askForPass: [true,  [Validators.required]],
      password: ['', [Validators.minLength(8),this.isAddMode ? Validators.required : Validators.nullValidator]],
    });

    if (!this.isAddMode) {
      this.userService.getById(this.id)
          .pipe(first())
          .subscribe(x => {
            this.myform.patchValue(x)
          });
  }
  }

  get f() {
    return this.myform.controls;
  }

  onSubmit() {
    this.submitted = true;
    console.log(this.f.email.errors);

    // stop here if form is invalid
    if (this.myform.invalid) {
      return;
    }

    this.loading = true;
    if (this.isAddMode) {
      this.createUser();
    } else {
      this.updateUser();
    }
  }

  createUser() {
    this.userService.create(this.myform.value)
    .pipe(first())
    .subscribe({
        next: () => {
            this.router.navigate(['/userslist']);
        },
        error: error => {
          if (error && error.error && error.error.errors )
          this.errorslist =error.error.errors;
            this.loading = false;
        }
    });
  }
  updateUser() {
    this.userService.update(this.id, this.myform.value)
    .pipe(first())
    .subscribe({
        next: () => {
          this.router.navigate(['/userslist']);
        },
        error: error => {
            if (error && error.error && error.error.errors )
            this.errorslist =error.error.errors;

            this.loading = false;
        }
    });
  }

  validPattern = "^([a-zA-Z0-9]+)$";
}
