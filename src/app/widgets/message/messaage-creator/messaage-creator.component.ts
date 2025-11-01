import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MessaageInputComponent } from '@entities/message/messaage-input/messaage-input.component';

@Component({
  selector: 'x-messaage-creator',
  imports: [CommonModule, MessaageInputComponent],
  templateUrl: './messaage-creator.component.html',
  styleUrl: './messaage-creator.component.scss'
})
export class MessaageCreatorComponent {

}
