import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BattleshipsComponent } from './battleships.component';

describe('BattleshipsComponent', () => {
  let component: BattleshipsComponent;
  let fixture: ComponentFixture<BattleshipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BattleshipsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BattleshipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
