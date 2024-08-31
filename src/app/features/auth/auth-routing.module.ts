import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [{ path: '', component: LoginComponent }, { path: 'register', component: RegisterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes), HttpClientModule],
  exports: [RouterModule]
  , providers: [ HttpClientModule,]
})
export class AuthRoutingModule { }
