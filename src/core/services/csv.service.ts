import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file';

@Injectable()
export class CsvService {

  constructor(public file: File) {}

  async exportToCsv(usersActivities) {
    usersActivities.sort((a, b) => {
      if(a.activity_name < b.activity_name) return -1;
      if(a.activity_name > b.activity_name) return 1;
      return 0;
    });
    const csv: any = this.convertToCSV(usersActivities);
    const fileName: string = 'pan-activities.csv';
    try {
      const fileEntry = await this.file.writeFile(this.file.externalRootDirectory, fileName, csv, true);
      return fileEntry;
    } catch (err) {
      const fileEntry = await this.file.writeExistingFile(this.file.externalRootDirectory, fileName, csv);
      return fileEntry;
    }
  }

  convertToCSV(usersActivities) {
    let ctr;
    let result = '';
    const columnDelimiter = ',';
    const lineDelimiter = '\n';
    const keys = Object.keys(usersActivities[0]);
    result += keys.join(columnDelimiter);
    result += lineDelimiter;
    usersActivities.forEach((item) => {
      ctr = 0;
      keys.forEach((key) => {
        if (ctr > 0) result += columnDelimiter;
        result += item[key];
        ctr++;
      });
      result += lineDelimiter;
    });

    return result;
  }

}
