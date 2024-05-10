import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { ChatPromptTemplate} from "@langchain/core/prompts";
import {RecursiveCharacterTextSplitter} from "langchain/text_splitter";
import {StringOutputParser} from "@langchain/core/output_parsers"

const text = "Look Mom no hands";
const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 200,
    chunkOverlap: 100,
});

const prompt = ChatPromptTemplate.fromMessages([
       [
        "system",
         `You are an expert translator. Format all responses as JSON objects with two keys: "original" and "translated".`,
       ],
       ["human", `Translate "{input}" into {language}.`],
     ]);

const model = new ChatOllama({
    baseUrl: "http://localhost:11434",
    model: "llama3",
    verbose: true,
})

const chain = prompt.pipe(model)


// const response = await chain.invoke({
//        input: "I love programming",
//        language: "German",
//     })
// const response = await model.invoke('Hello?')
// console.log('hi');
export const config = async (req, res, next) => {
    const input = await splitter.splitText(req.body.text);
        res.locals.chain = await chain.invoke({
        input,
        language: "French",
    })
    return next();
}
