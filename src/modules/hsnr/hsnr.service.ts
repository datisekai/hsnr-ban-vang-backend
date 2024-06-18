import { Injectable } from '@nestjs/common';
import { Captcha69Service } from '../captcha69/captcha69.service';
import { HttpService } from '@nestjs/axios';
import { TransferStatus } from '../order/order.constant';
import * as fs from 'fs';
import { HsnrDto } from '../order/order.dto';

@Injectable()
export class HsnrService {
  private HSNR_URL: string;
  private HSNR_USER: string;
  private HSNR_PASSWORD: string;
  private HSNR_SERVER: string;
  private HSNR_GOOGLE_KEY: string;
  constructor(
    private readonly capcha69Service: Captcha69Service,
    private readonly httpService: HttpService,
  ) {
    this.HSNR_URL = process.env.HSNR_URL;
    this.HSNR_USER = process.env.HSNR_USER;
    this.HSNR_PASSWORD = process.env.HSNR_PASSWORD;
    this.HSNR_SERVER = process.env.HSNR_SERVER;
    this.HSNR_GOOGLE_KEY = process.env.HSNR_GOOGLE_KEY;
  }

  async login() {
    console.log('login');
    const capchaId = await this.capcha69Service.getId(
      this.HSNR_GOOGLE_KEY,
      this.HSNR_URL,
    );
    console.log('get capchaId success', capchaId);
    if (capchaId) {
      const token = await this.capcha69Service.getToken(capchaId);
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
          'https://api.hoisinhngocrong.com/_api/game_account/login',
          payload,
        );
        fs.writeFileSync('./token.txt', response.data.data.token);
        return response.data.data.token;
      }
    }
    return '';
  }

  async sendGold(data: HsnrDto) {
    console.log(`send gold ${data}`);
    let token = '';
    try {
      token = fs.readFileSync('./token.txt', 'utf8');
    } catch (error) {}
    if (!token) {
      token = await this.login();
    }
    console.log('token hsnr', token);
    if (token) {
      try {
        await this.httpService.axiosRef.post(
          'https://api.hoisinhngocrong.com/_api/game_account/sendGold',
          data,
          {
            headers: {
              Authorization: `${token}`,
            },
          },
        );
        return TransferStatus.Success;
      } catch (error) {
        console.log(error);
        if (error?.response?.status == 401) {
          await this.login();
          return this.sendGold(data);
        }
        return TransferStatus.SendGoldFail;
      }
    }

    return TransferStatus.LoginFail;
  }
}
