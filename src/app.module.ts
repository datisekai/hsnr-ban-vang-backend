import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessControlModule } from 'nest-access-control';
import { join } from 'path';
import { AppController } from './app.controller';
import { roles } from './app.role';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { Captcha69Module } from './modules/captcha69/captcha69.module';
import { OrderModule } from './modules/order/order.module';
import { UploadModule } from './modules/upload/upload.module';
import { UserModule } from './modules/user/user.module';
import { HsnrModule } from './modules/hsnr/hsnr.module';
import { MetaModule } from './modules/meta/meta.module';

@Module({
  imports: [
    // TypeOrmModule.forRoot(),
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: process.env.MONGODB_URL,
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
      synchronize: true,
      autoLoadEntities: true,
    }),
    AccessControlModule.forRoles(roles),
    AuthModule,
    UserModule,
    UploadModule,
    OrderModule,
    Captcha69Module,
    HsnrModule,
    MetaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
