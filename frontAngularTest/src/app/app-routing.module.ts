import { AddEditUserComponent } from './add-edit-user/add-edit-user.component';
import { ListUsersComponent } from './list-users/list-users.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './shared/auth.guard';

const routes: Routes = [
{
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard]
},
{
  path: 'userslist',
  component: ListUsersComponent,
  canActivate: [AuthGuard]
},
{ path: 'add',
  component: AddEditUserComponent,
  canActivate: [AuthGuard],
  data: { isAdmin: true}

},
{ path: 'edit/:id',
  component: AddEditUserComponent,
  canActivate: [AuthGuard],
  data: { isAdmin: true}
},
{
    path: 'login',
    component: LoginComponent
},
{ path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
