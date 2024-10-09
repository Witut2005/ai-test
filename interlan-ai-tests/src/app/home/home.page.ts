import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

enum Operations {
  CreateGrid = 'CREATE_GRID',
  GridAdd = 'ADD_ROW',
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  Operations = Operations;

  columnNames: string[] = [];
  rows: any[] = [];

  descriptions: { [key: string]: string } = {
    [Operations.CreateGrid]: 'Create a grid with specified column names.',
    [Operations.GridAdd]: 'Add a row to the grid.',
  };

  examples: { [key: string]: string } = {
    [Operations.CreateGrid]:
      "Declare 'properties' key and set it to ['name', 'age', 'height']",
    [Operations.GridAdd]:
      "Set 'name' to 'nicho', 'age' to 20 and 'height' to 200",
  };

  ngModelPrompt: string = '';
  ngModelOperation: string = Operations.CreateGrid;
  waitingForResponse: boolean = false;

  constructor(private http: HttpClient) {}

  getPromptBeginning() {
    const b =
      "Create a json object. Use '```json' at the begging of json and '```' at the end.";

    if (
      this.ngModelOperation == Operations.CreateGrid ||
      this.ngModelOperation == Operations.GridAdd
    ) {
      return `${b}. Set 'operation' key to '${this.ngModelOperation}'. `;
    } else {
      throw new Error('Unknown operation');
    }
  }

  sendPrompt() {
    console.log(`${this.getPromptBeginning()}${this.ngModelPrompt}`);

    if (this.ngModelPrompt.length == 0) {
    }

    this.waitingForResponse = true;
    this.http
      .post(environment.llamaCppBackendIp, {
        prompt: `${this.getPromptBeginning()}${this.ngModelPrompt}`,
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
    console.group();
    console.log('columns', this.columnNames);
    console.log('rows', this.rows);
    console.groupEnd();
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
