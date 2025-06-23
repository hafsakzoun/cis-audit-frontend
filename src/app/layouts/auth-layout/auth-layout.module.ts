// auth-layout.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthLayoutComponent } from './auth-layout.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthLayoutRoutes } from './auth-layout.routing';
import { ReactiveFormsModule } from '@angular/forms'; 

@NgModule({
  declarations: [
    AuthLayoutComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    CommonModule,
    AuthLayoutRoutes,
    ReactiveFormsModule
  ]
})
export class AuthLayoutModule { }
