import { Injectable } from '@nestjs/common';
import { Captcha69Service } from '../captcha69/captcha69.service';
import { HttpService } from '@nestjs/axios';
import { TransferStatus } from '../order/order.constant';
import * as fs from 'fs';
import { HsnrDto } from '../order/order.dto';
import { MetaService } from '../meta/meta.service';
import { RecaptchaService } from '../recaptcha/recaptcha.service';

@Injectable()
export class HsnrService {
  private HSNR_URL: string;
  private HSNR_USER: string;
  private HSNR_PASSWORD: string;
  private HSNR_SERVER: string;
  private HSNR_GOOGLE_KEY: string;
  private lock = false;
  constructor(
    private readonly capcha69Service: Captcha69Service,
    private readonly recaptchaService: RecaptchaService,
    private readonly httpService: HttpService,
    private readonly metaService: MetaService,
  ) {
    this.HSNR_URL = process.env.HSNR_URL;
    this.HSNR_USER = process.env.HSNR_USER;
    this.HSNR_PASSWORD = process.env.HSNR_PASSWORD;
    this.HSNR_SERVER = process.env.HSNR_SERVER;
    this.HSNR_GOOGLE_KEY = process.env.HSNR_GOOGLE_KEY;
  }

  async login() {
    if (this.lock) return console.log('login locked');
    this.lock = true;
    console.log('login');
    const capchaId = await this.recaptchaService.getId(
      this.HSNR_GOOGLE_KEY,
      this.HSNR_URL,
    );
    console.log('get capchaId success', capchaId);
    try {
      if (capchaId) {
        console.time('get token');
        const token = await this.recaptchaService.getToken(capchaId);
        console.timeEnd('get token');
        console.log('captcha69 token', token);
        if (token) {
          const payload = {
            username: this.HSNR_USER,
            password: this.HSNR_PASSWORD,
            server: this.HSNR_SERVER,
            captcha: token,
          };
          console.log('payload login', payload);
          const response = await this.httpService.axiosRef.post(
            'https://api1.hoisinhngocrong.com/_api/game_account/login',
            payload,
            {
              headers: {
                Cookie: 'vfw=8c0c08aaf5080e371c0d0722039216a3',
              },
            },
          );
          console.log('response header', response.headers);
          console.log('login success, update token', response.data.data.token);
          // fs.writeFileSync('./token.txt', response.data.data.token);
          await this.metaService.update('token', {
            meta_value: { token: response.data.data.token },
          });
          return response.data.data.token;
        }
      }
    } catch (error) {
    } finally {
      this.lock = false;
    }
    return '';
  }

  async sendGold(data: HsnrDto) {
    let token = '';
    try {
      const setting = await this.metaService.get('setting_data');
      if (setting.meta_value && setting.meta_value['stop_send_tv']) {
        return;
      }
      console.log(`send gold`, data);
      const metaToken = await this.metaService.get('token');
      if (metaToken) {
        token = metaToken.meta_value.token;
      }
    } catch (error) {}
    if (!token) {
      const tokenLogin = await this.login();
      token = tokenLogin;
    }
    console.log('token hsnr', token);
    if (token) {
      try {
        const response = await this.httpService.axiosRef.post(
          'https://api1.hoisinhngocrong.com/_api/game_account/sendGold',
          data,
          {
            headers: {
              Authorization: `${token}`,
              Cookie: 'vfw=8c0c08aaf5080e371c0d0722039216a3',
            },
          },
        );
        console.log(response);
        if (response.data.code == 1) {
          return TransferStatus.Success;
        }
        return TransferStatus.SendGoldFail;
      } catch (error) {
        console.log(error);
        if (error?.response?.status == 401) {
          await this.login();
          // return this.sendGold(data);
        }
        return TransferStatus.SendGoldFail;
      }
    }

    return TransferStatus.LoginFail;
  }

  async gameHistory() {
    try {
      let token = '';
      const metaToken = await this.metaService.get('token');
      if (metaToken) {
        token = metaToken.meta_value.token;
      }

      if (!token) {
        token = await this.login();
      }
      const response = await this.httpService.axiosRef.get(
        'https://api1.hoisinhngocrong.com/_api/game_history_goldbar/searchByMem?limit=50&offset=0',
        {
          headers: {
            Authorization: token,
            Cookie: 'vfw=8c0c08aaf5080e371c0d0722039216a3',
          },
        },
      );
      return { data: response.data.data.rows };
    } catch (error) {
      console.log('gameHistory error', error);
      return { data: [] };
    }
  }
}
