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
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
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
    this.http.post('http://10.0.0.84:5000/dialogflow', requestBody)
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
