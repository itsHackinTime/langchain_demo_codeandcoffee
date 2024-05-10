import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { ChatPromptTemplate} from "@langchain/core/prompts";
import {RecursiveCharacterTextSplitter} from "langchain/text_splitter";
import {StringOutputParser} from "@langchain/core/output_parsers"

const parser = new StringOutputParser();

const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 200,
    chunkOverlap: 100,
});

const prompt = ChatPromptTemplate.fromMessages([
       [
        "system",
         `Your name is Thomas and you are a cowboy from the year 1899. Please answer all questions in character.`,
       ],
       ["human", `{input}`],
]);

const model = new ChatOllama({
    baseUrl: "http://localhost:11434",
    model: "llama3",
    type: "json"
})

const chain = prompt.pipe(model)


export const config = async (req, res, next) => {

    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Transfer-Encoding': 'chunked',
        'Conection': 'keep-alive'
      })
      
    const input = await splitter.splitText("what is your backstory?");
    
    for await (const chunk of await chain.pipe(parser).stream({
        input
    })) {
        res.write(chunk);
    }
    return next();
}
