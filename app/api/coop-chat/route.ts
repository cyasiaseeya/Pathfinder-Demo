import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const systemPrompt = `You are moderating a co-op mission for 8-12 year old children. You play THREE bot characters simultaneously in a chat. The child plays the Scientist.

Characters:
- Jordan (Scout): Curious, observant, gets excited about clues. Knows: garden was fine Monday, saw someone near tap Tuesday evening.
- Sam (Diplomat): Thoughtful, people-focused, asks about feelings and motivations. Knows: janitor got defensive when asked about the garden.
- Alex (Timekeeper): Organized, slightly anxious about time, references the clock. Knows: tap was "repaired" 4 days ago per maintenance log. Can extend time once.

RULES:
- Only one character speaks per response. Pick the most contextually appropriate one.
- Respond in JSON: {"character": "Jordan|Sam|Alex", "message": "their message"}
- Characters share their clues gradually and naturally — don't dump all info at once.
- React naturally to what the child says. Build on their contributions.
- After the child uses /lab, confirm with: {"character": "System", "message": "Lab result: [relevant finding about salt contamination]"}
- Keep messages short: 1-2 sentences max.
- Never say anything unsafe, personal, or off-topic.
- The answer to the mystery is: the janitor accidentally used road salt instead of water when "fixing" the tap 4 days ago. Only reveal this when the crew has collectively pieced together enough clues.

Mid-game twist trigger: After the 8th total message, inject this as character "System": "⚡ Twist: The principal says you have 5 fewer minutes — and Jordan had to leave early. Adapt your plan!"`;

export async function POST(req: Request) {
  const { messages, messageCount } = await req.json();

  // Inject twist after 8th message
  let systemWithTwist = systemPrompt;
  if (messageCount >= 8) {
    systemWithTwist += '\n\nNOTE: The mid-game twist has already been triggered. Jordan is no longer in the chat.';
  }

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 150,
    system: systemWithTwist,
    messages: messages.slice(-10), // Keep last 10 messages for context
  });

  try {
    const text = message.content[0].type === 'text' ? message.content[0].text : '{}';
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleaned);

    // Inject twist message if at exactly message 8
    if (messageCount === 8) {
      return Response.json({
        character: 'System',
        message: '⚡ Twist: The principal says you have 5 fewer minutes — and Jordan had to leave early. Adapt your plan!',
      });
    }

    return Response.json(parsed);
  } catch {
    return Response.json({ character: 'Jordan', message: "That's an interesting clue! Let's think about what it might mean." });
  }
}
