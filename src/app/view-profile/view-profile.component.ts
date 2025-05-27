import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { MessageService } from '../services/message.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // ✅ Required for ngModel



@Component({
  selector: 'app-view-profile',
  standalone: true,
  imports: [CommonModule, FormsModule], // ✅ Add FormsModule here
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css']
})
export class ViewProfileComponent implements OnInit {
  userId!: number;
  userData!: User;
  messageContent = '';


constructor(
  private route: ActivatedRoute,
  private userService: UserService,
  private messageService: MessageService
) {}


  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.userId = +idParam;
        this.fetchUser();
      }
    });
  }

  fetchUser(): void {
    this.userService.getUserById(this.userId).subscribe(user => {
      this.userData = user;
    });
  }


  sendMessage(): void {
  const senderId = Number(localStorage.getItem('userId'));
  const recipientId = this.userId;

  this.messageService.sendMessage(senderId, recipientId, this.messageContent).subscribe({
    next: () => {
      alert('Message sent!');
      this.messageContent = '';
    },
    error: (err) => {
      alert('Failed to send message: ' + err.message);
    }
  });

  }
}
