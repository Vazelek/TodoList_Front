import { Component, input, Input, InputSignal } from '@angular/core';
import { TaskItem } from '../../../../core/type/task-item.type';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { SocketService } from '../../../../core/service/socket.service';


@Component({
  selector: 'app-task-item',
  imports: [
    MatCheckboxModule
  ],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.scss',
  standalone: true
})
export class TaskItemComponent {
  public taskItem: InputSignal<TaskItem> = input.required<TaskItem>();

  constructor(
    private socketService: SocketService
  ) {}

  check(checked : boolean) {
    // TODO : send to backend

    if (checked) {
      this.taskItem().completed_by = "moi"
    }
    else {
      this.taskItem().completed_by = null
    }
  }
}
