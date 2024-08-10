import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { sleep } from 'src/common/helpers';

@Injectable()
export class Captcha69Service {
  private CAPTCHA69_KEY: string;
  constructor(private readonly httpService: HttpService) {
    this.CAPTCHA69_KEY = process.env.CAPTCHA_KEY;
  }

  async getId(google_key: string, page_url?: string) {
    if (!google_key) return '';
    console.log({
      key: this.CAPTCHA69_KEY,
      googlekey: google_key,
      method: 'userrecaptcha',
      pageurl: page_url,
    });
    try {
      const response = await this.httpService.axiosRef.get(
        'https://captcha69.com/in.php',
        {
          params: {
            key: this.CAPTCHA69_KEY,
            googlekey: google_key,
            method: 'userrecaptcha',
            pageurl: page_url,
          },
        },
      );
      const text = response.data;
      console.log('text', text);
      if (text.includes('OK|')) {
        return text.split('OK|')[1];
      }
      return '';
    } catch (error) {
      console.log(error);
      return '';
    }
  }

  async getToken(id: string) {
    const maxLoopCount = 40;
    let count = 0;
    const timeSleep = 5000; //ms
    while (count < maxLoopCount) {
      count++;
      const text = await this.callRes(id);
      console.log('getToken', count, text);
      if (text === 'CAPCHA_NOT_READY') {
        await sleep(timeSleep);
        continue;
      }
      return text;
    }
  }

  async callRes(id: string) {
    try {
      const response = await this.httpService.axiosRef.get(
        'https://captcha69.com/res.php',
        {
          params: {
            key: this.CAPTCHA69_KEY,
            action: 'get',
            id,
          },
        },
      );
      const text = response.data;
      if (text === 'CAPCHA_NOT_READY') return 'CAPCHA_NOT_READY';
      if (text.includes('OK|')) return text.split('OK|')[1];
      return '';
    } catch (error) {
      return '';
    }
  }
}
