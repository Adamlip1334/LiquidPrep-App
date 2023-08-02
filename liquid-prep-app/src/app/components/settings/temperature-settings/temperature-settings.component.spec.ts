import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemperatureSettingsComponent } from './temperature-settings.component';

describe('TemperatureSettingsComponent', () => {
  let component: TemperatureSettingsComponent;
  let fixture: ComponentFixture<TemperatureSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemperatureSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TemperatureSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
