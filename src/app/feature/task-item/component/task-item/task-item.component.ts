import { Component, Input } from '@angular/core';
import { TaskItem } from '../../../../core/type/task-item.type';

@Component({
  selector: 'app-task-item',
  imports: [],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.scss',
  standalone: true
})
export class TaskItemComponent {
  @Input({required: true}) taskItem!: TaskItem;

}
