import {Component, inject, input, Input, InputSignal, Signal} from '@angular/core';
import { TaskItem } from '../../../../core/type/task-item.type';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {AuthenticationStore} from '../../../../core/store/authentication.store';
import {DatePipe} from '@angular/common';


@Component({
  selector: 'app-task-item',
  imports: [
    MatCheckboxModule,
    DatePipe
  ],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.scss',
  standalone: true
})
export class TaskItemComponent {
  public taskItem: InputSignal<TaskItem> = input.required<TaskItem>();

  private readonly userEmail: string = inject(AuthenticationStore).loggedUserEmail() ?? '';

  check(checked : boolean) {
    if (checked) {
      this.taskItem().completed_by = this.userEmail
    }
    else {
      this.taskItem().completed_by = null
    }
  }
}
