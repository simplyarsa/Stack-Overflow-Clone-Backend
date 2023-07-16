import { Configuration, OpenAIApi } from "openai";
import dotenv from 'dotenv';

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const chatbot=async(req,res)=>{
  
  try {
    const {questionBody}=req.body;
    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content: questionBody}],
      });
      res.status(200).json({message:completion.data.choices[0].message})
  } catch (error) {
    res.status(500).json({message:error.message})
  } 
}
