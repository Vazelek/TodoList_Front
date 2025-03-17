import {Component, inject, input, Input, InputSignal, Signal} from '@angular/core';
import { TaskItem } from '../../../../core/type/task-item.type';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {AuthenticationStore} from '../../../../core/store/authentication.store';
import {DatePipe} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {BACKEND_URI} from '../../../../core/component/constant/url.constant';


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

  private readonly http: HttpClient = inject(HttpClient);

  public check(checked : boolean) {
    this.taskItem().completed_by = checked ? this.userEmail : null;

    this.http.put(`${BACKEND_URI}/list/update`, this.taskItem(), {withCredentials: true}).subscribe();
  }
}
