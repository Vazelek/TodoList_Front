import {ChangeDetectorRef, Component, inject, OnInit, Signal} from '@angular/core';
import {MatListModule} from '@angular/material/list';
import {MatDividerModule} from '@angular/material/divider';
import { CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray } from '@angular/cdk/drag-drop';
import { ListItem } from '../../../../core/type/list-item.type';
import { ListItemComponent } from '../../../list-item/component/list-item/list-item.component';
import {HttpClient} from '@angular/common/http';
import {BACKEND_URI} from '../../../../core/constant/url.constant';
import {MatButton} from '@angular/material/button';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {MatFormField, MatHint, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {TaskItem} from '../../../../core/type/task-item.type';
import {AuthenticationStore} from '../../../../core/store/authentication.store';

@Component({
  selector: 'app-home',
  imports: [
    MatListModule,
    MatDividerModule,
    ListItemComponent,
    MatButton,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatFormField,
    MatHint,
    MatInput,
    MatLabel,
    MatSuffix,
    ReactiveFormsModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: true
})
export class HomeComponent implements OnInit {
  public listItems : ListItem[] = [];

  public newListFormGroup!: FormGroup;

  public readonly userEmail: Signal<string | undefined> = inject(AuthenticationStore).loggedUserEmail;

  private nameFormControl: FormControl<string | null> = new FormControl(null, [Validators.required]);

  private readonly http: HttpClient = inject(HttpClient);

  public ngOnInit() {
    this.http.get<ListItem[]>(`${BACKEND_URI}/lists`, { withCredentials: true}).subscribe((lists: ListItem[]) => {
      this.listItems = lists;
    })

    this.newListFormGroup = new FormGroup({
      name: this.nameFormControl,
    })
  }

  public onNewListSubmit(): void {
    this.http.post<ListItem>(
      `${BACKEND_URI}/lists/new`,
      {
        name: this.nameFormControl.value,
      },
      { withCredentials: true }
    ).subscribe((list: ListItem) => {
      this.listItems.push(list);
    })
  }
}
