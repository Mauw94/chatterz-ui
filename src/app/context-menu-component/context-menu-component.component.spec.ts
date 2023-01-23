import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextMenuComponentComponent } from './context-menu-component.component';

describe('ContextMenuComponentComponent', () => {
  let component: ContextMenuComponentComponent;
  let fixture: ComponentFixture<ContextMenuComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContextMenuComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextMenuComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
