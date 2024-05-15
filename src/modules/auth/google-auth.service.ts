import { Module, Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';

// Expected audience for App Engine.
const expectedAudience = `/projects/your-project-number/apps/your-project-id`;
// IAP issuer
const issuers = ['https://cloud.google.com/iap'];

@Injectable()
export class GoogleAuthService {
  private oAuth2Client: OAuth2Client;

  constructor() {
    this.oAuth2Client = new OAuth2Client({
      clientId: process.env.GOOGLE_CLIENT_ID,
    });
  }

  async verifyIdToken(idToken: string) {
    try {
      const ticket = await this.oAuth2Client.verifyIdToken({
        idToken: idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      return {
        email: payload.email,
        image: payload.picture,
        name: payload.name,
      };
    } catch (error) {
      return null;
    }
  }
}
