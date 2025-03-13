import { Component, Input } from '@angular/core';
import { ListItem } from '../../../../core/type/list-item.type';

@Component({
  selector: 'app-list-item',
  imports: [],
  templateUrl: './list-item.component.html',
  styleUrl: './list-item.component.scss',
  standalone: true
})
export class ListItemComponent {
  @Input({required: true}) listItem!: ListItem;
}
