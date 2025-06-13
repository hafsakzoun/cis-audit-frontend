import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { ScriptGeneratorComponent } from '../../script-generator/script-generator.component';
import { ScriptsListComponent } from '../../scripts-list/scripts-list.component';
import { RulesExtractorComponent } from '../../rules-extractor/rules-extractor.component';
import { AuditHistoryComponent } from '../../audit-history/audit-history.component';
import { MyProfileComponent } from '../../my-profile/my-profile.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { AboutComponent } from '../../about/about.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'script-generator',   component: ScriptGeneratorComponent },
    { path: 'scripts-list',     component: ScriptsListComponent },
    { path: 'rules-extractor',     component: RulesExtractorComponent },
    { path: 'audit-history',          component: AuditHistoryComponent },
    { path: 'my-profile',           component: MyProfileComponent },
    { path: 'notifications',  component: NotificationsComponent },
    { path: 'about',        component: AboutComponent },
];
