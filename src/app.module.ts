import { Module } from '@nestjs/common';
import { TelegramModule } from './modules/telegram/telegram.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TelegrafModule } from 'nestjs-telegraf';
import { sessionMiddleware } from './modules/telegram/middlewares/session.middleware';

@Module({
  imports: [
    TelegramModule,
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: ((configService: ConfigService) => ({
        w: 'majority',
        retryWrites: true,
        uri: configService.get('MONGO_URI'),
        dbName: configService.get('MONGO_DB')
      }))
    }),
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: ((configService: ConfigService) => ({
        token: configService.get('TG_TOKEN'),
        middlewares: [sessionMiddleware]
      }))
    })
  ]
})
export class AppModule {
}
