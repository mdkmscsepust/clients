import { Component, NgZone, OnInit } from '@angular/core';
import { AppService } from './app.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  message = '';
  messages: string[] = [];
  constructor(private appService: AppService, private ngZone: NgZone) { 
    // Initialize any services or data here if needed

  }
  protected title = 'clients';
  ngOnInit() {
    
    this.appService.connect('ws://localhost:8000/ws'); // or ws:// for local dev

    this.appService.messages().subscribe((msg) => {
      //this.ngZone.run(() => {
      this.messages.push(msg);
    //});
    });
  }

  sendMessage() {
    this.appService.send(this.message);
    this.message = '';
  }
}
