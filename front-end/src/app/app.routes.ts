import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TaxCreateComponent } from './tax/create/create.component';
import { TaxEditComponent } from './tax/edit/edit.component';
import { TaxIndexComponent } from './tax/index/index.component';
import { CategoryManageComponent } from './categories/manage/manage.component';
import { CategoryCreateComponent } from './categories/create/create.component';
import { CategoryEditComponent } from './categories/edit/edit.component';
// import { ProductCreateComponent } from './product/create/create.component';
import { ProductEditComponent } from './product/edit/edit.component';
import { ProductManageComponent } from './product/manage/manage.component';
import { ProductCreateComponent } from './product/create/create.component';
import { UnitCreateComponent } from './unit/create/create.component';
import { UnitManageComponent } from './unit/manage/manage.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'tax', redirectTo: '/tax/create', pathMatch: 'full' },
  { path: 'categories', redirectTo: '/tax/create', pathMatch: 'full' },

  { path: 'home', component: HomeComponent },
  { path: 'tax/manage', component: TaxIndexComponent },
  { path: 'tax/create', component: TaxCreateComponent },
  { path: 'tax/edit/:id', component: TaxEditComponent },
  { path: 'categories/manage', component: CategoryManageComponent },
  { path: 'categories/create', component: CategoryCreateComponent },
  { path: 'categories/edit/:id', component: CategoryEditComponent },
  { path: 'products/create', component: ProductCreateComponent },
  { path: 'products/manage', component: ProductManageComponent },
  { path: 'products/edit/:id', component: ProductEditComponent },
  { path: 'units/create', component: UnitCreateComponent },
  { path: 'units/manage', component: UnitManageComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
