import {Component, effect, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';
import {TaskItem} from '../../../../core/type/task-item.type';
import {TaskItemComponent} from '../../../task-item/component/task-item/task-item.component';
import {HttpClient} from '@angular/common/http';
import {BACKEND_URI} from '../../../../core/constant/url.constant';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle, MatDateRangePicker} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {MatList, MatListItem} from '@angular/material/list';
import {User} from '../../../../core/type/user.type';
import {SocketService} from '../../../../core/service/socket.service';
import {AuthenticationStore} from '../../../../core/store/authentication.store';

interface List {
  name: string,
  id: number
}

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

  public taskItems: TaskItem[] = [];

  public listItem: List | undefined = undefined;

  public users: User[] = [];

  public newTaskFormGroup!: FormGroup;

  public grantAccessFormGroup!: FormGroup;

  public userIsOwner: WritableSignal<boolean> = signal(false)
  public readonly authenticationStore: AuthenticationStore = inject(AuthenticationStore);
  private nameFormControl: FormControl<string | null> = new FormControl(null, [Validators.required]);
  private dateFormControl: FormControl<Date | null> = new FormControl(null, [Validators.required]);
  private emailFormControl: FormControl<string | null> = new FormControl(null, [Validators.required, Validators.email]);
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
          this.taskItems.push(data.task)
        });

        this.socketService.onMessage("grantAccess").subscribe((data) => {
          this.users.push({email: data.email, has_right: 0});
        });

        this.socketService.onMessage("revokeAccess").subscribe((data) => {
          
        });
      }
    })
  }

  public ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');

    this.http.get<List>(`${BACKEND_URI}/list/${this.id}`, {withCredentials: true}).subscribe((list: List) => {
      this.listItem = list;
    })

    this.http.get<TaskItem[]>(`${BACKEND_URI}/list/${this.id}/items`, {withCredentials: true}).subscribe((tasks: TaskItem[]) => {
      this.taskItems = tasks.sort((a, b) => a.position - b.position);
    })

    this.http.get<User[]>(`${BACKEND_URI}/list/${this.id}/users`, {withCredentials: true}).subscribe((users: User[]) => {
      this.users = users;

      this.userIsOwner.set(users.some((user: User) => user.email === this.authenticationStore.loggedUserEmail() && user.has_right === 1));
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
    if (event.previousIndex == event.currentIndex) {
      return
    }
    this.socketService.sendMessage("moveTaskItem", {
      id: this.id,
      previousIndex: event.previousIndex,
      currentIndex: event.currentIndex
    })
  }

  public onNewTaskSubmit(): void {
    this.http.post<TaskItem>(
      `${BACKEND_URI}/list/${this.id}/new`,
      {
        name: this.nameFormControl.value,
        end_date: this.dateFormControl.value?.toString(),
        position: this.taskItems.length,
      },
      {withCredentials: true}
    ).subscribe((task: TaskItem) => {
      this.socketService.sendMessage("addTask", {id: this.id, task: task})
    })
  }

  public onGrantAccessSubmit(): void {
    this.http.post(
      `${BACKEND_URI}/lists/grant_access`,
      {
        email: this.emailFormControl.value,
        list_id: parseInt(this.id as string),
      },
      {withCredentials: true}
    ).subscribe(() => {
      this.socketService.sendMessage("grantAccess", { id: this.id, email: this.emailFormControl.value as string })
    })
  }

  public onRevokeAccess(email: string): void {
    this.http.post(
      `${BACKEND_URI}/lists/revoke_access`,
      {
        email,
        list_id: parseInt(this.id as string),
      },
      {withCredentials: true}
    ).subscribe(() => {
      const index = this.users.findIndex((user: User) => user.email === email);
      this.users.splice(index, 1);
    })
  }
}
