import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { WelcomePage } from './welcome.page';
import { LoginPage } from "../login/login.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: WelcomePage
      }
    ])
  ],
  declarations: [WelcomePage, LoginPage],
  entryComponents: [LoginPage]
})
export class WelcomePageModule {}
