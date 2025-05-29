import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ViewProfileComponent } from '../view-profile/view-profile.component';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {
  favorites: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.http.get<any[]>(`http://127.0.0.1:8000/users/${userId}/favorites`)
        .subscribe(data => this.favorites = data);
    }
  }

  removeFavorite(favUserId: number): void {
    const userId = localStorage.getItem('userId');
    this.http.delete(`http://127.0.0.1:8000/users/${userId}/favorites/${favUserId}`)
      .subscribe(() => this.ngOnInit());
  }
}
