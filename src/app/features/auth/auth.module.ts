import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CoreModule } from '../../core/core.module';


@NgModule({
  declarations: [ ],
  imports: [
    CommonModule,
    HttpClientModule,
    AuthRoutingModule,  
  ]
  , providers: [ HttpClientModule,]
})
export class AuthModule { }
