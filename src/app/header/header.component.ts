import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // Import RouterModule


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule], // Add RouterModule to imports
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

}
