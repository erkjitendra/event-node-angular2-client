import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { LoginComponent } from './app/components/login/login.component';
import { AdminComponent } from './app/components/admin/admin.component';
import { UserComponent } from './app/components/user/user.component';
import { GoogleComponent } from './app/components/google-login/google.component';
import { ErrorComponent } from './app/components/error/error.component';


const appRoutes : Routes = [
    {
        path:'',
        component:LoginComponent
    },
       {
        path:'admin',
        component:AdminComponent
    },
       {
        path:'user',
        component:UserComponent
    },
    {
        path:'google/login',
        component:GoogleComponent
    },
    {
        path:'error',
        component:ErrorComponent
    },
    {
        path:'**',
        component:LoginComponent
    }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);