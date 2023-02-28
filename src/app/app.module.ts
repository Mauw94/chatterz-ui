import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ChatRoomComponent } from './chat-room/chat-room.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from 'src/guards/auth.guard';
import { ChatComponent } from './chat/chat.component';
import { CookieService } from 'ngx-cookie-service';
import { NavbarComponent } from './navbar/navbar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MainComponent } from './main/main.component';
import { DatePipe } from '@angular/common';
import { ScrollToBottomDirective } from './directives/scroll-to-bottom.directive';
import { WordGuesserComponent } from './word-guesser/word-guesser.component';
import { UsersComponent } from './users/users.component';
import { ContextMenuComponentComponent } from './context-menu-component/context-menu-component.component';
import { GameChatComponent } from './game-chat/game-chat.component';
import { BombermanComponent } from './bomberman/bomberman.component';
import { SpaceInvadersComponent } from './space-invaders/space-invaders.component';
import { BattleshipsComponent } from './battleships/battleships.component';
import { RegisterComponent } from './register/register.component';
import { AlienizationComponent } from './alienization/alienization.component';
import { AngularDeviceInformationService } from 'angular-device-information';

@NgModule({
  declarations: [
    AppComponent,
    ChatRoomComponent,
    ChatComponent,
    LoginComponent,
    NavbarComponent,
    MainComponent,
    ScrollToBottomDirective,
    WordGuesserComponent,
    UsersComponent,
    ContextMenuComponentComponent,
    GameChatComponent,
    BombermanComponent,
    SpaceInvadersComponent,
    BattleshipsComponent,
    RegisterComponent,
    AlienizationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
  ],
  providers: [AuthGuard, CookieService, DatePipe, AngularDeviceInformationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
