import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { TaxCreateComponent } from './tax/create/create.component';
import { TaxIndexComponent } from './tax/index/index.component';
import { CategoryManageComponent } from './categories/manage/manage.component';
import { CategoryCreateComponent } from './categories/create/create.component';
import { CategoryEditComponent } from './categories/edit/edit.component';
import { ProductManageComponent } from './product/manage/manage.component';
import { ProductCreateComponent } from './product/create/create.component';
import { UnitCreateComponent } from './unit/create/create.component';
import { UnitManageComponent } from './unit/manage/manage.component';
import { UnitEditComponent } from './unit/edit/edit.component';
import { InvoiceCreateComponent } from './invoice/create/create.component';
import { InvoiceManageComponent } from './invoice/manage/manage.component';
import { SalesComponent } from './sales/sales.component';
import { SupplierCreateComponent } from './suppliers/create/create.component';
import { SupplierManageComponent } from './suppliers/manage/manage.component';
import { SupplierEditComponent } from './suppliers/edit/edit.component';
import { ProductDetailComponent } from './product/detail/detail.component';
import { ProductOutterEditComponent } from './product/edit/edit.component';
import { LoginComponent } from './login/login.component';
import { authGuard } from './auth/auth.guard';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SettingsComponent } from './settings/settings.component';
import { ProfileComponent } from './settings/profile/profile.component';
import { PasswordComponent } from './settings/password/password.component';

export const routes: Routes = [
  { path: '', redirectTo: '404', pathMatch: 'full' },
  { path: 'tax', redirectTo: '/tax/create', pathMatch: 'full' },
  { path: 'categories', redirectTo: '/categories/create', pathMatch: 'full' },
  { path: 'products', redirectTo: '/products/create', pathMatch: 'full' },
  { path: 'invoices', redirectTo: '/invoices/create', pathMatch: 'full' },
  { path: 'suppliers', redirectTo: '/suppliers/create', pathMatch: 'full' },

  { path: '404', component: PageNotFoundComponent },
  { path: 'login', component: LoginComponent },

  {
    path: '',
    canActivate: [authGuard],
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'tax/manage', component: TaxIndexComponent },
      { path: 'tax/create', component: TaxCreateComponent },
      { path: 'categories/manage', component: CategoryManageComponent },
      { path: 'categories/create', component: CategoryCreateComponent },
      { path: 'categories/edit/:id', component: CategoryEditComponent },
      { path: 'products/create', component: ProductCreateComponent },
      { path: 'products/manage', component: ProductManageComponent },
      { path: 'products/edit/:id', component: ProductOutterEditComponent },
      { path: 'products/detail/:id', component: ProductDetailComponent },
      { path: 'units/create', component: UnitCreateComponent },
      { path: 'units/manage', component: UnitManageComponent },
      { path: 'units/edit/:id', component: UnitEditComponent },
      { path: 'invoices/create', component: InvoiceCreateComponent },
      { path: 'invoices/manage', component: InvoiceManageComponent },
      { path: 'sales', component: SalesComponent },
      { path: 'suppliers/create', component: SupplierCreateComponent },
      { path: 'suppliers/manage', component: SupplierManageComponent },
      { path: 'suppliers/edit/:id', component: SupplierEditComponent },
      {
        path: 'setting/user/account',
        component: ProfileComponent,
        pathMatch: 'full',
      },
      {
        path: 'setting/user/password',
        component: PasswordComponent,
        pathMatch: 'full',
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes), BrowserAnimationsModule],
  exports: [RouterModule],
})
export class AppRoutingModule {}
