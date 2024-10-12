import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TaxCreateComponent } from './tax/create/create.component';
import { TaxEditComponent } from './tax/edit/edit.component';
import { TaxIndexComponent } from './tax/index/index.component';
import { CategoryManageComponent } from './categories/manage/manage.component';
import { CategoryCreateComponent } from './categories/create/create.component';
import { CategoryEditComponent } from './categories/edit/edit.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'tax/manage', component: TaxIndexComponent },
  { path: 'tax/create', component: TaxCreateComponent },
  { path: 'tax/edit/:id', component: TaxEditComponent },
  { path: 'tax', redirectTo: '/tax/create', pathMatch: 'full' },
  { path: 'categories/manage', component: CategoryManageComponent },
  { path: 'categories/create', component: CategoryCreateComponent },
  { path: 'categories/edit/:id', component: CategoryEditComponent },
  { path: 'categories', redirectTo: '/tax/create', pathMatch: 'full' },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
