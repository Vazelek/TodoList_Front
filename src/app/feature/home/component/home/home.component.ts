import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {MatListModule} from '@angular/material/list';
import {MatDividerModule} from '@angular/material/divider';
import { CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray } from '@angular/cdk/drag-drop';
import { ListItem } from '../../../../core/type/list-item.type';
import { ListItemComponent } from '../../../list-item/component/list-item/list-item.component';
import {HttpClient} from '@angular/common/http';
import {BACKEND_URI} from '../../../../core/component/constant/url.constant';

@Component({
  selector: 'app-home',
  imports: [
    MatListModule,
    MatDividerModule,
    ListItemComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: true
})
export class HomeComponent implements OnInit {
  public listItems : ListItem[] = [];

  private readonly http: HttpClient = inject(HttpClient);

  public ngOnInit() {
    this.http.get<ListItem[]>(`${BACKEND_URI}/lists`, { withCredentials: true}).subscribe((lists: ListItem[]) => {
      this.listItems = lists;
    })
  }
}
