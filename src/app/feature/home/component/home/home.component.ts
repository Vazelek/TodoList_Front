import { Component, effect } from '@angular/core';
import {MatListModule} from '@angular/material/list';
import {MatDividerModule} from '@angular/material/divider';
import { CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray } from '@angular/cdk/drag-drop';
import { ListItem } from '../../../../core/type/list-item.type';
import { ListItemComponent } from '../../../list-item/component/list-item/list-item.component';
import { SocketService } from '../../../../core/service/socket.service';

@Component({
  selector: 'app-home',
  imports: [
    MatListModule,
    MatDividerModule,
    CdkDropList,
    CdkDrag,
    ListItemComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: true
})
export class HomeComponent {
  lists : ListItem[] = [
    {id: 1, name: "name1"},
    {id: 2, name: "name2"},
    {id: 3, name: "name3"},
    {id: 4, name: "name4"},
    {id: 5, name: "name5"},
  ];

  constructor(
    private socketService: SocketService
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

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.lists, event.previousIndex, event.currentIndex);
  }
}
