import { ChatOpenAI } from '@langchain/openai';
import dotenv from 'dotenv';

dotenv.config();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL;
const MODEL_NAME = process.env.MODEL_NAME;

const model = new ChatOpenAI({ 
    modelName: MODEL_NAME,
    apiKey: OPENAI_API_KEY,
    configuration: {
        baseURL: OPENAI_BASE_URL,
    },
});

const response = await model.invoke("介绍下自己");
console.log(response.content);