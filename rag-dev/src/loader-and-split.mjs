import "dotenv/config";
import"cheerio";
import { CheerioWebBaseLoader } from"@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
const cheerioLoader = new CheerioWebBaseLoader(
"https://juejin.cn/post/7233327509919547452",
  {
    selector: '.main-area p'
  }
);

const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 400,
  chunkOverlap: 50,
  separators: ["\n\n", "\n", "。", "，", "？", "！", "：", "；", "、", " ", ""],
});

const documents = await cheerioLoader.load();
const splitDocuments = await textSplitter.splitDocuments(documents);

console.log(splitDocuments);