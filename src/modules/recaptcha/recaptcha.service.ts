import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { sleep } from 'src/common/helpers';

@Injectable()
export class RecaptchaService {
  private CAPTCHA_KEY: string;
  constructor(private readonly httpService: HttpService) {
    this.CAPTCHA_KEY = process.env.ANTICAPTCHA_KEY;
  }

  async getId(google_key: string, page_url?: string) {
    if (!google_key) return '';
    console.log({
      key: this.CAPTCHA_KEY,
      googlekey: google_key,
      method: 'userrecaptcha',
      pageurl: page_url,
    });
    try {
      const response = await this.httpService.axiosRef.post(
        'https://anticaptcha.top/in.php',
        {
          key: this.CAPTCHA_KEY,
          method: 'userrecaptcha',
          googlekey: google_key,
          pageurl: page_url,
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
    const timeSleep = 2000; //ms
    while (count < maxLoopCount) {
      count++;
      const text = await this.callRes(id);
      console.log('getToken', count, text);
      if (text === 'CAPCHA_NOT_READY') {
        await sleep(timeSleep);
        continue;
      }
      if (text === 'ERROR') return '';
      return text;
    }
  }

  async callRes(id: string) {
    try {
      const response = await this.httpService.axiosRef.get(
        'https://anticaptcha.top/res.php',
        {
          params: {
            key: this.CAPTCHA_KEY,
            id,
            json: 1,
          },
        },
      );
      const status = response.data.status;
      const text = response.data.request;
      if (!status) {
        if (text == 'CAPCHA_NOT_READY') {
          return 'CAPCHA_NOT_READY';
        }
        return 'ERROR';
      }
      return text;
    } catch (error) {
      return 'ERROR';
    }
  }
}
