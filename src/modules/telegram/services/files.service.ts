import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as fs from 'fs';

@Injectable()
export class FilesService {
  constructor(private readonly httpService: HttpService) {
  }

  downloadFile(fileUrl: string, path: string, fileName: string) {
    this.httpService.get(fileUrl, {
      responseType: 'stream',
      method: 'GET'
    }).subscribe(value => {
      value.data.pipe(fs.createWriteStream(`${path}/${fileName}`));
    });
  }
}
