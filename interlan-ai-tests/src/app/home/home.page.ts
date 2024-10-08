import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  ngModelPrompt: string =
    "create a json object. User value should be set to 'nicho', and age to 15. Use '```json' at the begging of json and '```' at the end";

  constructor() {}
}
