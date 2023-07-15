import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

export const chatbot=async(req,res)=>{
    const {questionBody}=req.body;
    // res.status(200).json({message: {content: questionBody}})
    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content: questionBody}],
      });
      res.status(200).json({message:completion.data.choices[0].message})
}
