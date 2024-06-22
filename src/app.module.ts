import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticleModule } from './article/article.module';
import { AuthModule } from './auth/auth.module';
import { BlogModule } from './blog/blog.module';
import { CartProductModule } from './cart-product/cart-product.module';
import { CommentModule } from './comment/comment.module';
import { DishModule } from './dish/dish.module';
import { PurchaseModule } from './purchase/purchase.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    DishModule,

    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        // type: configService.get<''>('TYPEORM_CONNECTION'),
        type: 'postgres',
        host: configService.get('TYPEORM_HOST'),
        port: configService.get('TYPEORM_PORT'),
        username: configService.get('TYPEORM_USERNAME'),
        password: configService.get('TYPEORM_PASSWORD'),
        database: configService.get('TYPEORM_DATABASE'),
        entities: [__dirname + '/**/*.entity{.js, .ts}'],
        synchronize: true,
        autoLoadEntities: true,
        logging: true,
      }),
    }),

    RestaurantModule,
    UserModule,
    PurchaseModule,
    CommentModule,
    BlogModule,
    ArticleModule,
    AuthModule,
    CartProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
