import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ItemComponent } from './pages/item/item.component';
import { ItemsComponent } from './pages/items/items.component';

export const routes: Routes = [
    { path: '', component: ItemsComponent },
    { path: 'item', component: ItemComponent },
  ];