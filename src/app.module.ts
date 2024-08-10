import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessControlModule } from 'nest-access-control';
import { join } from 'path';
import { AppController } from './app.controller';
import { roles } from './app.role';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { Captcha69Module } from './modules/captcha69/captcha69.module';
import { HsnrModule } from './modules/hsnr/hsnr.module';
import { MetaModule } from './modules/meta/meta.module';
import { OrderModule } from './modules/order/order.module';
import { SieuThiCodeModule } from './modules/sieuthicode/sieuthicode.module';
import { UploadModule } from './modules/upload/upload.module';
import { UserModule } from './modules/user/user.module';
import { TransactionsService } from './modules/transaction/transaction.service';
import { TransactionModule } from './modules/transaction/transaction.module';

@Module({
  imports: [
    // TypeOrmModule.forRoot(),
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
      synchronize: true,
      autoLoadEntities: true,
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: +process.env.REDIS_PORT || 17438,
        password: process.env.REDIS_PASSWORD,
        username: process.env.REDIS_USER,
      },
    }),
    ScheduleModule.forRoot(),
    AccessControlModule.forRoles(roles),
    AuthModule,
    UserModule,
    UploadModule,
    OrderModule,
    Captcha69Module,
    HsnrModule,
    MetaModule,
    SieuThiCodeModule,
    // TransactionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
