import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  auditOverviewUrl: SafeResourceUrl;
  cisControlsUrl: SafeResourceUrl;
  scriptExecutionUrl: SafeResourceUrl;
  auditResultsUrl: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.auditOverviewUrl = this.sanitizeUrl('http://localhost:5601/app/dashboards#/view/e418eea3-344d-4ecb-81f8-9971bda82cc2?embed=true&_g=(refreshInterval:(pause:!t,value:60000),time:(from:now-15m,to:now))');
    this.cisControlsUrl = this.sanitizeUrl('http://localhost:5601/app/dashboards#/view/YOUR_CIS_DASHBOARD_ID?embed=true&_g=(refreshInterval:(pause:!t,value:60000),time:(from:now-15m,to:now))');
    this.scriptExecutionUrl = this.sanitizeUrl('http://localhost:5601/app/dashboards#/view/YOUR_SCRIPT_EXEC_DASHBOARD_ID?embed=true&_g=(refreshInterval:(pause:!t,value:60000),time:(from:now-15m,to:now))');
    this.auditResultsUrl = this.sanitizeUrl('http://localhost:5601/app/dashboards#/view/YOUR_AUDIT_RESULTS_DASHBOARD_ID?embed=true&_g=(refreshInterval:(pause:!t,value:60000),time:(from:now-15m,to:now))');
  }

  sanitizeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
