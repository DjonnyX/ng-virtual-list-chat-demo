import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'chat', pathMatch: 'full' },
    { path: 'chat', loadComponent: () => import('./pages/chat/chat/chat.component').then(m => m.ChatComponent) },
];
