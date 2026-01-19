import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { ArticlesModule } from './articles/articles.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { DocumentsModule } from './documents/documents.module';
import { PracticeAreasModule } from './practice-areas/practice-areas.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
    }),
    AuthModule,
    UsersModule,
    PrismaModule,
    ArticlesModule,
    DocumentsModule,
    PracticeAreasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}