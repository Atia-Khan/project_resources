import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectResourcesModule } from './project_resources/project_resources.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), 
    MongooseModule.forRoot(process.env.DATABASE_URL),
    ProjectResourcesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
