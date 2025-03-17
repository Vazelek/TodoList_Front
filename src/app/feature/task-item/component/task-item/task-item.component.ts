import {Component, effect, inject, input, Input, InputSignal, Signal} from '@angular/core';
import { TaskItem } from '../../../../core/type/task-item.type';
import {MatCheckboxChange, MatCheckboxModule} from '@angular/material/checkbox';
import { SocketService } from '../../../../core/service/socket.service';
import { AuthenticationStore } from '../../../../core/store/authentication.store';
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
  @Input({required: true}) listId !: string | null

  private loggedUserEmail = inject(AuthenticationStore).loggedUserEmail

  constructor(
    private socketService: SocketService
  ) {
    let defined = this.socketService.defined
    effect(() => {
      if (defined()) {
        this.socketService.onMessage("checked").subscribe((data) => {
          if (data.taskId == this.taskItem().id.toString()) {
            if (data.checkedValue) {
              this.taskItem().completed_by = data.userEmail
            }
            else {
              this.taskItem().completed_by = null
            }
          }
        });
      }
    })
  }

  check(event : MatCheckboxChange) {
    this.socketService.sendMessage("checked", {
      id: this.listId,
      userEmail: this.loggedUserEmail(),
      checkedValue: event.checked,
      taskId: this.taskItem().id
    })
  }
}
