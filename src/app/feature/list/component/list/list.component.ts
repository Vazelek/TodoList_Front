import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray } from '@angular/cdk/drag-drop';
import { TaskItem } from '../../../../core/type/task-item.type';
import { TaskItemComponent } from '../../../task-item/component/task-item/task-item.component';
import {HttpClient} from '@angular/common/http';
import {BACKEND_URI} from '../../../../core/constant/url.constant';
import {ListItem} from '../../../../core/type/list-item.type';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle, MatDateRangePicker} from '@angular/material/datepicker';
import {DateAdapter, provideNativeDateAdapter} from '@angular/material/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {subscribe} from 'node:diagnostics_channel';
import {MatList, MatListItem} from '@angular/material/list';
import {User} from '../../../../core/type/user.type';
import {sign} from 'node:crypto';

interface List { name: string , id: number }
interface GrantAccess { email: string , list_id: number }

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
    MatButton,
    MatList,
    MatListItem
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

  public users: User[] = [];

  public newTaskFormGroup!: FormGroup;

  public grantAccessFormGroup!: FormGroup;

  private nameFormControl: FormControl<string | null> = new FormControl(null, [Validators.required]);

  private dateFormControl: FormControl<Date | null> = new FormControl(null, [Validators.required]);

  private emailFormControl: FormControl<string | null> = new FormControl(null, [Validators.required, Validators.email]);

  private readonly http: HttpClient = inject(HttpClient);

  constructor(private route: ActivatedRoute, private cdr: ChangeDetectorRef) {}

  public ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');

    this.http.get<List>(`${BACKEND_URI}/list/${this.id}`, { withCredentials: true}).subscribe((list: List) => {
      this.listItem = list;
    })

    this.http.get<TaskItem[]>(`${BACKEND_URI}/list/${this.id}/items`, { withCredentials: true}).subscribe((tasks: TaskItem[]) => {
      this.taskItems = tasks.sort((a, b) =>  a.position - b.position);
    })

    this.http.get<User[]>(`${BACKEND_URI}/list/${this.id}/users`, { withCredentials: true}).subscribe((users: User[]) => {
      this.users = users;
    })

    this.newTaskFormGroup = new FormGroup({
      name: this.nameFormControl,
      endDate: this.dateFormControl,
    })

    this.grantAccessFormGroup = new FormGroup({
      email: this.emailFormControl,
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

  public onGrantAccessSubmit(): void {
    this.http.post<GrantAccess>(
      `${BACKEND_URI}/lists/grant_access`,
      {
        email: this.emailFormControl.value,
        list_id: parseInt(this.id as string),
      },
      { withCredentials: true }
    ).subscribe(() => {
      this.users.push({email: this.emailFormControl.value as string, has_right: 0});
    })
  }
}
