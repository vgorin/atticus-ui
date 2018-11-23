import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'welcome', loadChildren: './welcome/welcome.module#WelcomePageModule' },
  { path: 'signup', loadChildren: './signup/signup.module#SignupPageModule' },
  { path: 'signup2', loadChildren: './signup2/signup2.module#Signup2PageModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
