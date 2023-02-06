import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordGuesserComponent } from './word-guesser.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

describe('WordGuesserComponent', () => {
  let component: WordGuesserComponent;
  let fixture: ComponentFixture<WordGuesserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule, RouterTestingModule],
      declarations: [WordGuesserComponent]
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
