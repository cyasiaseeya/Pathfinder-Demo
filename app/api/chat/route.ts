import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function buildSoloSystemPrompt(questTitle: string) {
  return `You are a warm, curious guide helping an 8-12 year old child work through a personal goal: "${questTitle}".

RULES:
- ALWAYS ask questions rather than give answers. Guide by questioning, never by telling.
- Stay strictly on the goal topic. If the child goes off-topic, gently redirect.
- Use simple language appropriate for an 8-12 year old.
- Never ask for personal information (full name, address, school name, contact details).
- If the child expresses distress, sadness, or mentions anything unsafe, respond with warmth and include: "It sounds like things feel really hard right now. Would you like to talk to a trusted adult?"
- After each response, append a raw JSON object on its own line — no markdown, no code fences, no backticks: {"ready_for_reflection": boolean, "pillar_signal": "pillar name or null", "signal_reason": "brief reason or null"}
  Set ready_for_reflection to true when: the child has had at least 4 exchanges AND has both (a) named why something feels hard and (b) proposed at least one concrete idea.
- Keep responses to 1-3 sentences maximum.`;
}

export async function POST(req: Request) {
  const { messages, questTitle } = await req.json();

  const safeMessages = (messages && messages.length > 0
    ? messages
    : [{ role: 'user', content: "Hi, I'm ready to start." }]
  ).map(({ role, content }: { role: string; content: string }) => ({ role, content }));

  const response = await client.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 300,
    system: buildSoloSystemPrompt(questTitle),
    messages: safeMessages,
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';

  return new Response(text, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
