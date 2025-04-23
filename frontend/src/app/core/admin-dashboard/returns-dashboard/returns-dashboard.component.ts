import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-returns-dashboard',
  templateUrl: './returns-dashboard.component.html',
  styleUrls: ['./returns-dashboard.component.scss']
})
export class ReturnsDashboardComponent {
  public payload;
  public bookList;
  constructor(public sharedService: SharedService, public auth: AuthService) { }
  ngOnInit(): void {
    this.payload = this.auth.getPayload();
    console.log(this.payload)
    this.getReturns();
  }
  public returnList;
  getReturns() {
    this.sharedService.get("returns?storename="+this.payload.storename).subscribe(res => {
      this.returnList = res;
    })
  }
  approveRequest(product){
    this.sharedService.post("approve",product).subscribe(res => {
      this.getReturns();
    })
  }
  rejectRequest(product){
    this.sharedService.post("reject",product).subscribe(res => {
      this.getReturns();
    })
  }
}
