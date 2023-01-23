import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-context-menu-component',
  templateUrl: './context-menu-component.component.html',
  styleUrls: ['./context-menu-component.component.css']
})
export class ContextMenuComponentComponent {

  @Input()
  contextMenuItems: Array<string>;
  
  @Output()
  onContextMenuItemClick: EventEmitter<any> = new EventEmitter<any>()

  onContextMenuClick(data: any): void {
    this.onContextMenuItemClick.emit(data)
  }
}
