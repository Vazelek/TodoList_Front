import { Component, effect, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray } from '@angular/cdk/drag-drop';
import { TaskItem } from '../../../../core/type/task-item.type';
import { TaskItemComponent } from '../../../task-item/component/task-item/task-item.component';
import {HttpClient} from '@angular/common/http';
import {BACKEND_URI} from '../../../../core/component/constant/url.constant';
import {ListItem} from '../../../../core/type/list-item.type';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle, MatDateRangePicker} from '@angular/material/datepicker';
import {DateAdapter, provideNativeDateAdapter} from '@angular/material/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {subscribe} from 'node:diagnostics_channel';
import { SocketService } from '../../../../core/service/socket.service';


interface List { name: string , id: number }

@Component({
  selector: 'app-list',
  imports: [
    TaskItemComponent,
    CdkDropList,
    CdkDrag,
    MatFormFieldModule,
    MatInputModule,
    MatDateRangePicker,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    ReactiveFormsModule,
    MatButton
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  standalone: true,
  providers: [provideNativeDateAdapter()],
})
export class ListComponent implements OnInit {
  public id: string | null = null;

  public taskItems : TaskItem[] = [];

  public listItem : List | undefined = undefined;

  public newTaskFormGroup!: FormGroup;

  private nameFormControl: FormControl<string | null> = new FormControl(null, [Validators.required]);

  private dateFormControl: FormControl<Date | null> = new FormControl(null, [Validators.required]);

  private readonly http: HttpClient = inject(HttpClient);

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
          moveItemInArray(this.taskItems, data.previousIndex, data.currentIndex);
        });

        this.socketService.onMessage("addTask").subscribe((data) => {
          this.taskItems.push(data.task);
        });
      }
    })
  }

  ngOnInit(): void {
    this.http.get<List>(`${BACKEND_URI}/list/${this.id}`, { withCredentials: true}).subscribe((list: List) => {
      this.listItem = list;
    })

    this.http.get<TaskItem[]>(`${BACKEND_URI}/list/${this.id}/items`, { withCredentials: true}).subscribe((tasks: TaskItem[]) => {
      this.taskItems = tasks.sort((a, b) =>  a.position - b.position);
    })

    this.newTaskFormGroup = new FormGroup({
      name: this.nameFormControl,
      endDate: this.dateFormControl,
    })
  }

  public drop(event: CdkDragDrop<string[]>) {
    if (event.previousIndex == event.currentIndex) {
      return
    }
    this.socketService.sendMessage("moveTaskItem", { id: this.id, previousIndex : event.previousIndex, currentIndex : event.currentIndex })
  }

  public onNewTaskSubmit(): void {
    if (!this.nameFormControl.value || !this.dateFormControl.value) {
      return
    }
    
    this.http.post<TaskItem>(
      `${BACKEND_URI}/list/${this.id}/new`,
      {
        name: this.nameFormControl.value,
        end_date: this.dateFormControl.value?.toString(),
        position: this.taskItems.length,
      },
      { withCredentials: true }
    ).subscribe((task: TaskItem) => {
      this.socketService.sendMessage("addTask", { id: this.id, task: task })
    })
  }
}
