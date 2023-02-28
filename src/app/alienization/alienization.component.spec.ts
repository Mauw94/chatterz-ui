import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlienizationComponent } from './alienization.component';

describe('AlienizationComponent', () => {
  let component: AlienizationComponent;
  let fixture: ComponentFixture<AlienizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlienizationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlienizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
