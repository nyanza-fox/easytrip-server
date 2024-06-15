import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources';

export const chatCompletion = async (messages: ChatCompletionMessageParam[]) => {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_SECRET });

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    response_format: { type: 'json_object' },
    messages,
  });

  return JSON.parse(completion.choices[0].message.content || '');
};
