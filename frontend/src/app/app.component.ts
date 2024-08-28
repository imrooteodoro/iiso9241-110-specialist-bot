import { Component, NgModule, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, CommonModule, FormsModule, MatIconModule, MatButtonModule],
  template: `<div class="chat-container" *ngIf="isChatOpen">
    <div class="chat-history" #chatHistory>
      <div *ngFor="let message of chat_history" class="chat-message">
        <div *ngIf="message.usuario" class="user-message">{{ message.usuario }}</div>
        <div *ngIf="message.bot" class="bot-message" [innerHTML]="message.bot"></div>
      </div>
    </div>
    <div class="chat-input">
      <input type="text" [(ngModel)]="mensagem" placeholder="Digite sua mensagem" (keyup.enter)="sendMessage()">
      <button (click)="sendMessage()">Enviar</button>
    </div>
  </div>
  
  <button mat-fab class="fab-button" (click)="toggleChat()">
    <mat-icon>chat</mat-icon>
  </button>
  `,
  styles: `.fab-button {
    position: fixed;
    bottom: 16px;
    right: 16px;
    color: green;
    background-color: black;
  }
  

.chat-container {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 400px;
    height: 500px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
  
    .chat-history {
      flex-grow: 1;
      overflow-y: auto;
      padding: 20px;
  
      .chat-message {
        margin-bottom: 10px;
  
        .user-message {
          background-color: #dcf8c6;
          border-radius: 15px;
          padding: 8px 12px;
          display: inline-block;
          max-width: 70%;
          text-align: left;
          word-wrap: break-word;
        }
  
        .bot-message {
          background-color: #f1f0f0;
          border-radius: 15px;
          padding: 8px 12px;
          display: inline-block;
          max-width: 70%;
          text-align: left;
          word-wrap: break-word;
        }
      }
    }
  
    .chat-input {
      display: flex;
      align-items: center;
      padding: 10px 20px;
      border-top: 1px solid #e6e6e6;
  
      input {
        flex-grow: 1;
        padding: 8px 12px;
        border: 1px solid #ccc;
        border-radius: 15px;
        font-size: 14px;
        outline: none;
      }
  
      button {
        margin-left: 10px;
        padding: 8px 16px;
        background-color: #4caf50;
        color: #fff;
        border: none;
        border-radius: 15px;
        font-size: 14px;
        cursor: pointer;
      }
    }
  }`
})


export class AppComponent implements OnInit, AfterViewChecked {
  mensagem: string = '';
  bot_messageHtml: SafeHtml | null = null;
  chat_history: { usuario: string; bot: SafeHtml | null }[] = [];
  isChatOpen: boolean = false;

  @ViewChild('chatHistory') private chatHistory!: ElementRef;

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    // Não há necessidade de chamar fetchDetails() aqui
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  sendMessage() {
    if (this.mensagem.trim() === '') {
      return; // Não enviar mensagens vazias
    }

    // Adicionar a mensagem do usuário ao histórico do chat
    this.chat_history.push({ usuario: this.mensagem, bot: null });

    const requestBody = { mensagem: this.mensagem };
    this.http.post('http://10.113.60.211:5000/dialogflow', requestBody)
      .subscribe(
        (resp: any) => {
          // Converter a mensagem do bot em HTML seguro
          this.bot_messageHtml = this.sanitizer.bypassSecurityTrustHtml(resp.resposta_do_bot);

          // Adicionar a mensagem do bot ao histórico do chat
          this.chat_history.push({ usuario: '', bot: this.bot_messageHtml });

          console.log('Bot message HTML:', this.bot_messageHtml);
        },
        (error) => {
          console.error('Error sending message:', error);
        }
      );

    // Limpar a caixa de mensagem
    this.mensagem = '';
  }

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
  }

  private scrollToBottom(): void {
    try {
      this.chatHistory.nativeElement.scrollTop = this.chatHistory.nativeElement.scrollHeight;
    } catch(err) {
      console.error('Error scrolling to bottom:', err);
    }
  }
}
