import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

export async function POST(req: Request) {
  const { answers, questTitle } = await req.json();

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 200,
    messages: [
      {
        role: 'user',
        content: `A child is working on the goal: "${questTitle}". Their reflection answers are:
${answers.map((a: string, i: number) => `${i + 1}. ${a}`).join('\n')}

Score their reflection readiness on a scale of 0-100. Respond ONLY with JSON:
{"score": number, "ready": boolean, "feedback": "one encouraging sentence"}`,
      },
    ],
  });

  try {
    const text = message.content[0].type === 'text' ? message.content[0].text : '{}';
    return Response.json(JSON.parse(text));
  } catch {
    return Response.json({ score: 75, ready: true, feedback: 'Great reflection!' });
  }
}
