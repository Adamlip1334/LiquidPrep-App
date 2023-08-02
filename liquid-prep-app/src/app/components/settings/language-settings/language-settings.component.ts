import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderService } from 'src/app/service/header.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-language-settings',
  templateUrl: './language-settings.component.html',
  styleUrls: ['./language-settings.component.scss']
})
export class LanguageSettingsComponent implements OnInit {
  public languageFrm: FormGroup

  constructor(
    private router: Router,
    private headerService: HeaderService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.headerService.updateHeader(
      'Language Settings',   // headerTitle
      'arrow_back',       // leftIconName
      'volume_up',  // rightIconName
      undefined,    // leftBtnClick
      undefined,    // rightBtnClick
    );

    this.languageFrm = this.fb.group({
      language: ['']
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
    const temperatureValue = this.languageFrm.get('language').value;
    console.log(temperatureValue);
  }


}
