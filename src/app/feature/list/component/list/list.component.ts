import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray } from '@angular/cdk/drag-drop';
import { TaskItem } from '../../../../core/type/task-item.type';
import { TaskItemComponent } from '../../../task-item/component/task-item/task-item.component';


@Component({
  selector: 'app-list',
  imports: [
    TaskItemComponent,
    CdkDropList,
    CdkDrag,
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  standalone: true
})
export class ListComponent {
  id: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  tasks : TaskItem[] = [
    {
      id: 1,
      name: "tache 1",
      end_date: new Date(),
      index: 0,
      completed_by: null,
    },
    {
      id: 2,
      name: "tache 2",
      end_date: new Date(),
      index: 0,
      completed_by: null,
    },
  ];

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.tasks, event.previousIndex, event.currentIndex);
  }
}
