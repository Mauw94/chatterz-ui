import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from 'src/guards/auth.guard';
import { ChatComponent } from './chat/chat.component';
import { MainComponent } from './main/main.component';
import { WordGuesserComponent } from './word-guesser/word-guesser.component';
import { BombermanComponent } from './bomberman/bomberman.component';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'chat', component: ChatComponent, canActivate: [AuthGuard] },
  { path: 'main', component: MainComponent, canActivate: [AuthGuard] },
  { path: 'wordguesser', component: WordGuesserComponent, canActivate: [AuthGuard] },
  { path: 'wordguesser/:id', component: WordGuesserComponent, canActivate: [AuthGuard] },
  { path: 'bomberman', component: BombermanComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
