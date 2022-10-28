import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CaseWorkerGuard } from './case-worker.guard';
import { LoginPageComponent } from './shared/components/login-page/login-page.component';
import { VeteranGuard } from './veteran.guard';

const routes: Routes = [
  {
    path: 'login',
    component: LoginPageComponent,
  },
  {
    path: 'case-worker',
    loadChildren: () =>
      import('./case-worker/case-worker.module').then(
        (m) => m.CaseWorkerModule
      ),
   canActivate: [CaseWorkerGuard],
  },
  {
    path: 'veteran',
    loadChildren: () =>
      import('./veteran/veteran.module').then((m) => m.VeteranModule),

    canActivate: [VeteranGuard],
  },
  { path: '**', redirectTo: 'veteran' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
