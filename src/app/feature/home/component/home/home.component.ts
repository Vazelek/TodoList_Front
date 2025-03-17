import { Component, effect, inject, OnInit } from '@angular/core';
import {MatListModule} from '@angular/material/list';
import {MatDividerModule} from '@angular/material/divider';
import { CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray } from '@angular/cdk/drag-drop';
import { ListItem } from '../../../../core/type/list-item.type';
import { ListItemComponent } from '../../../list-item/component/list-item/list-item.component';
import { SocketService } from '../../../../core/service/socket.service';
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
  listItems : ListItem[] = []

  constructor(
    private socketService: SocketService,
    private http: HttpClient
  ) {
    let defined = this.socketService.defined
    effect(() => {
      if (defined()) {
        this.socketService.onMessage("grantAccess").subscribe((data) => {
          // TODO : ajouter liste
        });
        this.socketService.onMessage("removeAccess").subscribe((data) => {
          // TODO : enlever liste
        });
      }
    })
  }

  public ngOnInit() {
    this.http.get<ListItem[]>(`${BACKEND_URI}/lists`, { withCredentials: true}).subscribe((lists: ListItem[]) => {
      this.listItems = lists;
    })
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.listItems, event.previousIndex, event.currentIndex);
  }
}
