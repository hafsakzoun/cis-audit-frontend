import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { ScriptGeneratorComponent } from '../../script-generator/script-generator.component';
import { ScriptsListComponent } from '../../scripts-list/scripts-list.component';
import { RulesExtractorComponent } from '../../rules-extractor/rules-extractor.component';
import { AuditHistoryComponent } from '../../audit-history/audit-history.component';
import { MyProfileComponent } from '../../my-profile/my-profile.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { AboutComponent } from '../../about/about.component';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatRippleModule} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSelectModule} from '@angular/material/select';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
  ],
  declarations: [
    DashboardComponent,
    ScriptGeneratorComponent,
    ScriptsListComponent,
    RulesExtractorComponent,
    AuditHistoryComponent,
    MyProfileComponent,
    NotificationsComponent,
    AboutComponent,
  ]
})

export class AdminLayoutModule {}
