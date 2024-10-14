import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

// ".\n\n```json\n{\n  \"user\": \"nicho\",\n  \"age\": 15\n}\n```\n\nthis is the json representation of a user object in a web application.\n\n```json\n{\n  \"name\": \"John Doe\",\n  \"email\": \"john.doe@example.com\",\n  \"age\": 30,\n  \"address\": {\n    \"street\": \"123 Main St.\",\n    \"city\": \"Anytown\",\n    \"state\": \"CA\",\n    \"",
