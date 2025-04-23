import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnsDashboardComponent } from './returns-dashboard.component';

describe('ReturnsDashboardComponent', () => {
  let component: ReturnsDashboardComponent;
  let fixture: ComponentFixture<ReturnsDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReturnsDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReturnsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
