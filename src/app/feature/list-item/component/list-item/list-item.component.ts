import { Component, Input } from '@angular/core';
import { ListItem } from '../../../../core/type/list-item.type';
import { NavigationService } from '../../../../core/service/navigation.service';


@Component({
  selector: 'app-list-item',
  imports: [],
  templateUrl: './list-item.component.html',
  styleUrl: './list-item.component.scss',
  standalone: true
})
export class ListItemComponent {
  @Input({required: true}) listItem!: ListItem;

  constructor(protected navigationService: NavigationService) {}
}
