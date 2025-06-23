import { Component, NgZone, OnInit,ChangeDetectorRef } from '@angular/core';
import { AppService } from './app.service';
import { CommonModule} from '@angular/common';
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
   prompt = 'বাংলাদেশের রাজধানী কোথায়?';
  response = '';
  loading = false;
  constructor(private appService: AppService, private ngZone: NgZone, private cdRef: ChangeDetectorRef) { 
    // Initialize any services or data here if needed

  }
  protected title = 'clients';
  ngOnInit() {
  }

  sendMessage() {
    this.appService.send(this.message);
    this.message = '';
  }

  startStream() {
    this.response = '';
    this.loading = true;

    const stream = this.appService.streamResponse(this.prompt);
    stream.onmessage = (event) => {
      this.ngZone.run(() => {
      if (event.data === '[END]') {
        stream.close();
        this.loading = false;
      } else {
        this.response += event.data + ' ';
        this.cdRef.detectChanges();
      }
    })
    };

    stream.onerror = () => {
      this.ngZone.run(() => {
      this.response += '\n[Error receiving response]';
      this.cdRef.detectChanges();
      stream.close();
      this.loading = false;
    })}
  }
}
