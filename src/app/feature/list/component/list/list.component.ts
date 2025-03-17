import {Component, inject, OnInit} from '@angular/core';
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

  constructor(private route: ActivatedRoute) {}

  public ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');

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
    moveItemInArray(this.taskItems, event.previousIndex, event.currentIndex);
  }

  public onNewTaskSubmit(): void {
    this.http.post<TaskItem>(
      `${BACKEND_URI}/list/${this.id}/new`,
      {
        name: this.nameFormControl.value,
        end_date: this.dateFormControl.value?.toString(),
        position: this.taskItems.length,
      },
      { withCredentials: true }
    ).subscribe((task: TaskItem) => {
      this.taskItems.push(task);
    })
  }
}
