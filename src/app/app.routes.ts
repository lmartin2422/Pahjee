import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DirectMessagesComponent } from './direct-messages/direct-messages.component';
import { SearchComponent } from './search/search.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { HeaderComponent } from './header/header.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ViewProfileComponent } from './view-profile/view-profile.component';
import { AuthGuard } from './auth.guard';



export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'home', component: HomeComponent} ,
    { path: 'messages', component: DirectMessagesComponent, canActivate: [AuthGuard]},
    { path: 'messages/:id', component: DirectMessagesComponent, canActivate: [AuthGuard] },
    { path: 'explore', component: SearchComponent, canActivate: [AuthGuard]},
    { path: 'favorites', component: FavoritesComponent, canActivate: [AuthGuard]},
    { path: 'update-profile', component: UpdateProfileComponent, canActivate: [AuthGuard]},
    { path: 'my-profile', component: MyProfileComponent, canActivate: [AuthGuard]},
    { path: 'profile/:id', component: ViewProfileComponent, canActivate: [AuthGuard]},
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/home', pathMatch: 'full'}
    
];


@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }
