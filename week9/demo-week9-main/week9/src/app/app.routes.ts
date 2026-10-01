import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Products } from './components/products/products';
import { Addproduct } from './components/addproduct/addproduct';
import { Updateproduct } from './components/updateproduct/updateproduct';
import { Chat } from './components/chat/chat';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'products', component: Products },
  { path: 'add-product', component: Addproduct },
  { path: 'update-product', component: Updateproduct },
  { path: 'chat', component: Chat }
];
