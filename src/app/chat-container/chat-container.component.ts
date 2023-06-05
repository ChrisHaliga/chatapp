import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-chat-container',
  templateUrl: './chat-container.component.html',
  styleUrls: ['./chat-container.component.scss']
})
export class ChatContainerComponent {

  constructor(@Inject(DOCUMENT) private document: Document, private http: HttpClient){}
  
  messages: Message[] = [];

  messageTrackBy(index:number, message:Message)
  {
    return index;
  }

  consumeUserInput(userInput:string)
  {
    this.callChatGpt(new Message('user', userInput))
  }

  callChatGpt(message:Message)
  {
    let messageEl = this.document.getElementById("messages");
    let oldMessages = this.messages;
    this.messages.push(message);
    scrollToBottom(messageEl);
    this.messages.push(new Message('assistant', '...'));
    this.http.post<any>(
      'https://api.openai.com/v1/chat/completions',
      {
        'model':'gpt-4',
        'temperature':0.2,
        'max_tokens': 1000,
        'n': 1,
        'messages': [...oldMessages, 
          new Message("system", "As a software engineer who often communicates with non-developers, it's essential to convey short inputs into concise, clear, and well-structured messages. The subject matter varies, and the audience mainly includes colleagues and friends. The tone should strike a balance between informal and formal, using simple language that is easy to understand. Also be sure to ensure that the messages are nicely formatted. If additional context or clarification is needed, please ask brief follow-up questions to ensure the final output is accurate and coherent. The goal is to create a message that is well-written but neither too wordy nor overly brief, and it should appear as if written by the original author. These are always text messages, do not write them as if they were emails. Can you convert this text message for me:"), 
          message
        ]
      },
      {
        headers: new HttpHeaders({
          'content-type': 'application/json',
          'OpenAI-Organization': 'org-GAl1U2maQPznxCpuvkKx3BCR',
          'Authorization': bearer xxxxxxxxxx // yeahhh I hardcoded this
        })
      }).subscribe(data => {
        this.messages.pop();
        for(let choice of data.choices)
        {
          let content:string = choice.message.content
          let validJson:boolean = false;

          try{
            let json:string = JSON.stringify(JSON.parse(content), null, 4);
            content = json;
            validJson = true;
          }
          catch{
            console.log("invalid JSON from AI");
          }

          //if(!validJson && !!content.match(/[.,:!?]$/))
          //  content = content.substring(0,content.length-1);

          this.messages.push(new Message('assistant', content));
          scrollToBottom(messageEl);
        }
      });
  }
}

class Message {
  role: string;
  content: string;

  constructor(role:string , content:string )
  {
    this.role = role;
    this.content = content;
  }
}

async function scrollToBottom(el:any)
{
  await sleep(25);

  if(el != null)
      el!.scrollTop = el.scrollHeight;
}

function sleep(ms:number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}