import { Component, OnInit } from '@angular/core';
import { HeaderService } from 'src/app/service/header.service';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-temperature-settings',
  templateUrl: './temperature-settings.component.html',
  styleUrls: ['./temperature-settings.component.scss']
})
export class TemperatureSettingsComponent implements OnInit {
  public temperatureFrm: FormGroup

  constructor(
    private router: Router,
    private headerService: HeaderService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.headerService.updateHeader(
      'Temperature Settings',   // headerTitle
      'arrow_back',       // leftIconName
      'volume_up',  // rightIconName
      undefined,    // leftBtnClick
      undefined,    // rightBtnClick
    );

    this.temperatureFrm = this.fb.group({
      temperature: ['']
    });
  }

  goBack() {
    this.router.navigate(['/settings']);
  }

  public onHeaderClick(data:string){
    if(data == 'leftBtn'){
      this.goBack();
    }else {
      //TODO
    }
  }

  onConfirmClick() {
    const temperatureValue = this.temperatureFrm.get('temperature').value;
    console.log(temperatureValue);
  }

}