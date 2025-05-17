import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BrowseFiltersComponent } from './browse-filters/browse-filters.component';
import { DirectMessagesComponent } from './direct-messages/direct-messages.component';
import { ExploreComponent } from './explore/explore.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { HeaderComponent } from './header/header.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';



export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'home', component: HomeComponent} ,
    { path: 'messages', component: DirectMessagesComponent},
    { path: 'explore', component: ExploreComponent},
    { path: 'favorites', component: FavoritesComponent},
     { path: 'update-profile', component: UpdateProfileComponent},
    { path: 'my-profile', component: MyProfileComponent},
    { path: '', component: LoginComponent },
    { path: '**', redirectTo: '/home', pathMatch: 'full' } // invalid
];


@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }
