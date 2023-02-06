import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameChatComponent } from './game-chat.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';

describe('GameChatComponent', () => {
  let component: GameChatComponent;
  let fixture: ComponentFixture<GameChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule, RouterTestingModule],
      declarations: [GameChatComponent],
      providers: [DatePipe]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
