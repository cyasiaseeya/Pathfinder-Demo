import Anthropic from '@anthropic-ai/sdk';
import { PILLARS } from '@/lib/pillars';

const client = new Anthropic();

export async function POST(req: Request) {
  const { sessionHistory } = await req.json();

  if (!sessionHistory || sessionHistory.length === 0) {
    return Response.json(
      PILLARS.map((p) => ({ pillar: p.key, observation: 'No sessions completed yet in this area.' }))
    );
  }

  // Compile signals per pillar
  const signals: Record<string, string[]> = {};
  PILLARS.forEach((p) => { signals[p.key] = []; });

  sessionHistory.forEach((session: { pillarSignals?: Record<string, string> }) => {
    if (session.pillarSignals) {
      Object.entries(session.pillarSignals).forEach(([pillarName, signal]) => {
        const pillar = PILLARS.find(
          (p) => p.name.toLowerCase().includes(pillarName.toLowerCase()) || p.key === pillarName
        );
        if (pillar && signal) {
          signals[pillar.key].push(signal as string);
        }
      });
    }
  });

  const pillarSummaries = PILLARS.map((p) => ({
    key: p.key,
    name: p.name,
    signals: signals[p.key],
  }));

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 800,
    messages: [
      {
        role: 'user',
        content: `You are writing a parent progress report for a child who has completed social-emotional learning sessions.

For each pillar below, write 1-2 warm, specific, parent-readable sentences based on the cited moments. If there are no signals, write a general encouraging observation. Address the parent directly (e.g., "Your child..."). Keep language simple, warm, and specific.

Pillars and cited moments:
${pillarSummaries.map((p) => `
${p.name}:
${p.signals.length > 0 ? p.signals.map((s, i) => `  ${i + 1}. ${s}`).join('\n') : '  (No specific moments recorded yet)'}
`).join('\n')}

Respond ONLY with valid JSON, no markdown:
[
  {"pillar": "pillar_key", "observation": "parent-readable text"},
  ...
]

Pillar keys to use: intrapersonal, interpersonal, communication, adaptability, growth`,
      },
    ],
  });

  try {
    const text = message.content[0].type === 'text' ? message.content[0].text : '[]';
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return Response.json(JSON.parse(cleaned));
  } catch {
    return Response.json(
      PILLARS.map((p) => ({
        pillar: p.key,
        observation: 'Your child engaged thoughtfully during their sessions, showing genuine effort and curiosity.',
      }))
    );
  }
}
