import {Component, inject, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray } from '@angular/cdk/drag-drop';
import { TaskItem } from '../../../../core/type/task-item.type';
import { TaskItemComponent } from '../../../task-item/component/task-item/task-item.component';
import {HttpClient} from '@angular/common/http';
import {BACKEND_URI} from '../../../../core/component/constant/url.constant';
import {ListItem} from '../../../../core/type/list-item.type';

interface List { name: string , id: number }

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
export class ListComponent implements OnInit {
  public id: string | null = null;

  public taskItems : TaskItem[] = [];

  public listItem : List | undefined = undefined;

  private readonly http: HttpClient = inject(HttpClient);

  constructor(private route: ActivatedRoute) {}

  public ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');

    this.http.get<List>(`${BACKEND_URI}/list/${this.id}`, { withCredentials: true}).subscribe((list: List) => {
      this.listItem = list;
    })

    this.http.get<TaskItem[]>(`${BACKEND_URI}/list/${this.id}/items`, { withCredentials: true}).subscribe((tasks: TaskItem[]) => {
      this.taskItems = tasks;
    })
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.taskItems, event.previousIndex, event.currentIndex);
  }
}
