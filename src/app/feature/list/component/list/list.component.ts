import { Component, effect, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray } from '@angular/cdk/drag-drop';
import { TaskItem } from '../../../../core/type/task-item.type';
import { TaskItemComponent } from '../../../task-item/component/task-item/task-item.component';
import { SocketService } from '../../../../core/service/socket.service';



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

  constructor(
    private route: ActivatedRoute,
    private socketService: SocketService
  ) {
    this.id = this.route.snapshot.paramMap.get('id');

    let defined = this.socketService.defined
    effect(() => {
      if (defined()) {
        this.socketService.sendMessage("enterList", this.id);

        this.socketService.onMessage("moveTaskItem").subscribe((data) => {
          console.log(data)
          moveItemInArray(this.tasks, data.previousIndex, data.currentIndex);
        });
      }
    })
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
      completed_by: "ta mère",
    },
  ];

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousIndex == event.currentIndex) {
      return
    }
    this.socketService.sendMessage("moveTaskItem", { id: this.id, previousIndex : event.previousIndex, currentIndex : event.currentIndex })
  }
}
