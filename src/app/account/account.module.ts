import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account.component';
import { OverviewComponent } from './overview/overview.component';
import { SettingsComponent } from './settings/settings.component';
import { ProfileDetailsComponent } from './settings/forms/profile-details/profile-details.component';
import { DeactivateAccountComponent } from './settings/forms/deactivate-account/deactivate-account.component';
import { SharedModule } from "../_metronic/shared/shared.module";
import { SignInMethodComponent } from '../modules/account/settings/forms/sign-in-method/sign-in-method.component';

@NgModule({
    declarations: [
        AccountComponent,
        OverviewComponent,
        SettingsComponent,
        ProfileDetailsComponent,
        SignInMethodComponent,
        DeactivateAccountComponent
    ],
    imports: [
        CommonModule,
        AccountRoutingModule,
        SharedModule
    ]
})
export class AccountModule {}
