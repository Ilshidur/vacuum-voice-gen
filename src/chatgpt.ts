import OpenAI from 'openai';

const MODELS = {
  'gpt-3.5-turbo-0613': { tokens: 4096 },
  'gpt-3.5-turbo-16k': { tokens: 16384 },
  'gpt-4o': { tokens: 4096 }, // TODO: Why only 4096 ?
};

const MODEL: keyof typeof MODELS = 'gpt-4o';

export async function complete(
  messages: OpenAI.ChatCompletionMessage[]
): Promise<string> {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const completion = await openai.chat.completions.create({
    model: MODEL,
    messages,
    max_tokens: MODELS[MODEL].tokens,
    temperature: Number(process.env.CHATGPT_TEMPERATURE) || 0.5,
  });

  const rawResponse = completion.choices[0].message?.content || '';

  return rawResponse;
}

export async function getCompletion(prompt: string) {
  return complete([
    {
      role: 'user',
      content: prompt,
    },
  ]);
}
