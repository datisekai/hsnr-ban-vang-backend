import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';

@Injectable()
export class CaptchaService {
  private readonly secretKey = process.env.CAPTCHA_SECRET_KEY; // Thay thế bằng secret key của bạn từ Google reCAPTCHA

  constructor(private readonly httpService: HttpService) {}

  async validateCaptcha(token: string): Promise<boolean> {
    const url = `https://www.google.com/recaptcha/api/siteverify`;

    try {
      // Gọi trực tiếp bằng axiosRef mà không dùng rxjs
      const response: AxiosResponse<any> = await this.httpService.axiosRef.post(
        `${url}?secret=${this.secretKey}&response=${token}`,
      );

      console.log('response', response);
      // Lấy kết quả trả về từ Google API
      const { success } = response.data;

      return success;
    } catch (error) {
      console.error('Lỗi khi xác thực captcha:', error);
      return false;
    }
  }
}
