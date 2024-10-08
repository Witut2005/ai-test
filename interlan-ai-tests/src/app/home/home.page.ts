import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

enum Operations {
  CreateGrid = 'CREATE',
  GridAdd = 'ADD',
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  columnNames: string[] = [];
  rows: any[] = [];

  descriptions: { [key: string]: string } = {
    [Operations.CreateGrid]: 'Create a grid with specified column names.',
    [Operations.GridAdd]: 'Add a row to the grid.',
  };

  examples: { [key: string]: string } = {
    [Operations.CreateGrid]:
      "operation' key should be set to 'CREATE' and 'properties' key to ['name', 'age', 'height']",
    [Operations.GridAdd]:
      "set 'operation' key to 'ADD',  'name' key to 'nicho', 'age' key to 20 and 'height' key to 200",
  };

  ngModelPrompt: string = '';

  ngModelOperation: string = Operations.CreateGrid;

  waitingForResponse: boolean = false;

  constructor(private http: HttpClient) {}

  sendPrompt() {
    this.waitingForResponse = true;
    this.http
      .post(environment.llamaCppBackendIp, {
        prompt:
          "Use '```json' at the begging of json and '```' at the end. Create a json object." +
          this.ngModelPrompt,
        n_predict: 128,
      })
      .subscribe((data: any) => {
        const b = data['content'] as string;

        const begin = b.indexOf('```json') + '```json'.length;
        const end = b.indexOf('```', begin + 1);

        try {
          const json = JSON.parse(b.slice(begin, end));
          console.log(json);
          this.handleOperation(json);
        } catch {
          console.error('Failed to parse JSON');
          console.log('RETURNED DATA', b);
        }

        this.waitingForResponse = false;

        // this.rows.push(JSON.parse(b.slice(begin, end)));
      });
  }

  log() {
    console.log(this.columnNames, this.rows);
  }

  handleOperation(json: any) {
    switch (json.operation) {
      case Operations.CreateGrid: {
        this.columnNames = json.properties;
        break;
      }

      case Operations.GridAdd: {
        this.rows.push(json);
        break;
      }
    }
  }
}
