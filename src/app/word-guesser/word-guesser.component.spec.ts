import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordGuesserComponent } from './word-guesser.component';

describe('WordGuesserComponent', () => {
  let component: WordGuesserComponent;
  let fixture: ComponentFixture<WordGuesserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WordGuesserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WordGuesserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
