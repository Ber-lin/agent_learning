import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { ConfigService } from '@nestjs/config';
import { ChatOpenAI } from '@langchain/openai';

@Module({
  controllers: [AiController],
  providers: [
    AiService,
    {
      provide: 'CHAT_MODEL',
      useFactory: () => {
        return new ChatOpenAI({
          modelName: process.env.MODEL_NAME,
          apiKey: process.env.OPENAI_API_KEY,
          configuration: {
            baseURL: process.env.OPENAI_BASE_URL,
          },
        });
      },
      inject: [ConfigService],
    },
  ],
})
export class AiModule {}
