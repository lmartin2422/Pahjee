import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BrowseFiltersComponent } from './browse-filters/browse-filters.component';
import { DirectMessagesComponent } from './direct-messages/direct-messages.component';
import { ExploreComponent } from './explore/explore.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { HeaderComponent } from './header/header.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { NgModule } from '@angular/core';


export const routes: Routes = [
    { path: 'home', component: HomeComponent} ,
    { path: 'messages', component: DirectMessagesComponent},
    { path: 'explore', component: ExploreComponent},
    { path: 'favorites', component: FavoritesComponent},
    { path: 'myprofile', component: MyProfileComponent},
    { path: '', redirectTo: '/home', pathMatch: 'full' }, // default route
    { path: '**', redirectTo: '/home', pathMatch: 'full' } // invali
];


@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }
