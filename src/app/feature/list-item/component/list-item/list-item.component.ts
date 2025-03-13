import { Component, Input } from '@angular/core';
import { ListItem } from '../../../../core/type/list-item.type';
import {CdkDrag} from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-list-item',
  imports: [
    CdkDrag,
  ],
  templateUrl: './list-item.component.html',
  styleUrl: './list-item.component.scss',
  standalone: true
})
export class ListItemComponent {
  @Input({required: true}) listItem!: ListItem;
}
