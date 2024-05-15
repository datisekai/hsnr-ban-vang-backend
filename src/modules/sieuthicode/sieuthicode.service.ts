import { Injectable } from '@nestjs/common';
import { Captcha69Service } from '../captcha69/captcha69.service';
import { HttpService } from '@nestjs/axios';

export interface HistoryMbbank {
  transactionID: string;
  amount: number;
  description: string;
  transactionDate: string;
  type: string;
}

@Injectable()
export class SieuThiCodeService {
  private baseUrl: string;
  private tokenMb: string;
  constructor(private readonly httpService: HttpService) {
    this.baseUrl = process.env.SIEUTHICODE_URL;
    this.tokenMb = process.env.TOKEN_MB;
  }

  async getHistoryMbbank(
    type: 'IN' | 'OUT' | 'ALL' = 'ALL',
    from?: string,
  ): Promise<HistoryMbbank[]> {
    const url = `${this.baseUrl}/historyapimbbankv2/${this.tokenMb}`;
    try {
      const response = await this.httpService.axiosRef.get(url);
      let transactions = response.data.transactions;
      if (type !== 'ALL') {
        transactions = transactions.filter((t) => t.type === type);
      }

      if (from) {
        transactions = transactions.filter((t) => {
          const transactionDates = t.transactionDate.split('/');
          const dateString = `${transactionDates[1]}/${transactionDates[0]}/${transactionDates[2]}`;
          return new Date(dateString) >= new Date(from);
        });
      }
      return transactions;
    } catch (err) {
      console.log(err);
      return [];
    }
  }
}
