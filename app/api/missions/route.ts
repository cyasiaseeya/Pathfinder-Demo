import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

export async function POST(req: Request) {
  const { quest, messages, reflections } = await req.json();

  const conversationSummary = messages
    .slice(-6)
    .map((m: { role: string; content: string }) => `${m.role === 'user' ? 'Child' : 'Guide'}: ${m.content}`)
    .join('\n');

  const reflectionSummary = reflections
    .map((r: string, i: number) => `${i + 1}. ${r}`)
    .join('\n');

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 500,
    messages: [
      {
        role: 'user',
        content: `A child worked on the goal: "${quest.title}" (pillar: ${quest.pillar}).

Recent conversation:
${conversationSummary}

Reflection answers:
${reflectionSummary}

Based on this child's quest conversation and reflections, generate exactly 3 specific, concrete, low-stakes real-world actions for them to try this week. Each must be achievable by an 8-12 year old, involve mild productive discomfort (e.g. trying something even if it might not go perfectly), and map to one of the five pillars: Intrapersonal EQ, Interpersonal EQ, Communication, Adaptability, Growth Mindset.

Respond ONLY with valid JSON, no markdown:
[
  {"title": "short action title", "description": "1-2 sentence description, second person, warm tone", "pillar": "pillar name"},
  {"title": "short action title", "description": "1-2 sentence description, second person, warm tone", "pillar": "pillar name"},
  {"title": "short action title", "description": "1-2 sentence description, second person, warm tone", "pillar": "pillar name"}
]`,
      },
    ],
  });

  try {
    const text = message.content[0].type === 'text' ? message.content[0].text : '[]';
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return Response.json(JSON.parse(cleaned));
  } catch {
    return Response.json([
      { title: 'Take one small step', description: 'Pick the smallest possible version of your goal and try it once this week.', pillar: 'Growth Mindset' },
      { title: 'Notice and name', description: 'When a feeling comes up around this situation, pause and name it out loud or in a journal.', pillar: 'Intrapersonal EQ' },
      { title: 'Ask one question', description: 'Start a conversation by asking one genuine question before sharing your own view.', pillar: 'Communication' },
    ]);
  }
}
