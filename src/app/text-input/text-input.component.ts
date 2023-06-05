import { Component, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss']
})
export class TextInputComponent {
  @Output() userInput = new EventEmitter<string>();

  submitUserInput(component:SubmitComponent) {
    this.userInput.emit(component.value);
    component.value = '';
  }
}

interface SubmitComponent{
  value: string;
}
