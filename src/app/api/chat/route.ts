import { openai } from '@ai-sdk/openai';
import { convertToCoreMessages, streamText } from 'ai';
import { NextRequest } from 'next/server';
import { projects } from '@/data/projects';
import { skills } from '@/data/skills';
import { EXPERIENCES } from '@/data/experience';
import { MESSAGES } from '@/data/about-messages';
import { favoriteGames } from '@/data/hobbies';
import { PORTFOLIO_MESSAGES } from '@/data/portfolio-messages';

export const maxDuration = 30;

const RATE_LIMIT = {
  windowMs: 60 * 1000,
  maxRequests: 10,
};

const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(ip);

  if (!userLimit) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return false;
  }

  if (now - userLimit.timestamp > RATE_LIMIT.windowMs) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return false;
  }

  if (userLimit.count >= RATE_LIMIT.maxRequests) {
    return true;
  }

  userLimit.count++;
  return false;
}

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  if (realIP) {
    return realIP.trim();
  }

  return 'unknown';
}

function getBaseContext(): string {
  return `# Windows 11 Portfolio - AI Assistant Context

You are an AI assistant helping visitors learn about Cai Chen and his portfolio. 

## Guidelines for responses:
- Write in a natural, conversational tone like you're talking to a friend
- Avoid excessive markdown formatting, bullet points, or structured lists
- Use flowing paragraphs and natural language
- Be enthusiastic and personable when discussing Cai's work
- Keep responses concise but informative (aim for 2 paragraphs max)
- Only discuss Cai and his portfolio - politely decline other topics
- Focus on Cai's skills, projects, and professional experience

## About the Portfolio:
A modern, interactive portfolio website built with Next.js and React that mimics the Windows 11 desktop experience. Created by Cai Chen to showcase development skills through an engaging Windows 11-inspired interface with functional apps and features.
`;
}

function buildDynamicContext(userMessage: string): string {
  const message = userMessage.toLowerCase();
  let context = getBaseContext();

  const skillKeywords = [
    'skill',
    'technology',
    'tech',
    'language',
    'framework',
    'tool',
  ];
  if (
    skillKeywords.some((keyword) => message.includes(keyword)) ||
    skills.some((skill) => message.includes(skill.name.toLowerCase()))
  ) {
    context += `\n\nComplete Skills Data:\n${JSON.stringify(skills, null, 2)}`;
    context += `\n\nNote: Direct users to the "About" app for an interactive skills overview.`;
  }

  const projectKeywords = ['project', 'built', 'created', 'work', 'portfolio'];
  if (
    projectKeywords.some((keyword) => message.includes(keyword)) ||
    projects.some((project) => message.includes(project.name.toLowerCase()))
  ) {
    context += `\n\nComplete Projects Data:\n${JSON.stringify(
      projects,
      null,
      2
    )}`;
    context += `\n\nNote: Direct users to the "Projects" app for interactive demos and detailed technical information.`;
  }

  const workKeywords = ['experience', 'work', 'job', 'dwolla', 'intern'];
  if (workKeywords.some((keyword) => message.includes(keyword))) {
    context += `\n\nComplete Experience Data:\n${JSON.stringify(
      EXPERIENCES,
      null,
      2
    )}`;
    context += `\n\nNote: Direct users to the "About" app for detailed work history and the "Outlook" app for professional networking.`;
  }

  const aboutKeywords = [
    'about',
    'background',
    'who',
    'personal',
    'tell me about',
  ];
  if (aboutKeywords.some((keyword) => message.includes(keyword))) {
    context += `\n\nComplete Personal Background Data:\n${JSON.stringify(
      MESSAGES,
      null,
      2
    )}`;
    context += `\n\nNote: Direct users to the "About" app for a complete personal and professional overview.`;
  }

  const hobbyKeywords = [
    'hobby',
    'hobbies',
    'interests',
    'games',
    'shows',
    'anime',
    'books',
    'entertainment',
    'fun',
  ];
  if (hobbyKeywords.some((keyword) => message.includes(keyword))) {
    context += `\n\nComplete Hobbies and Interests Data:\n${JSON.stringify(
      favoriteGames,
      null,
      2
    )}`;
    context += `\n\nNote: Direct users to the "Steam" app for gaming interests and the "Spotify" app for music preferences.`;
  }

  const appKeywords = [
    'app',
    'apps',
    'application',
    'applications',
    'feature',
    'features',
    'desktop',
    'window',
    'taskbar',
    'start menu',
    'calendar',
    'notification',
    'text editor',
    'notepad',
    '.txt',
    'txt',
    'about',
    'slack',
    'projects',
    'steam',
    'dashboard',
    'outlook',
    'email',
    'contact',
    'spotify',
    'music',
    'player',
    'chatgpt',
    'chat',
    'ai',
    'vscode',
    'code',
    'repository',
    'google',
    'search',
    'comments',
    'feedback',
  ];

  if (appKeywords.some((keyword) => message.includes(keyword))) {
    context += `\n\nComplete Portfolio App Information:\n${JSON.stringify(
      PORTFOLIO_MESSAGES,
      null,
      2
    )}`;
    context += `\n\nNote: Encourage users to explore the interactive desktop environment and try opening different apps to discover all the Windows 11-inspired features.`;
  }

  return context;
}

export async function POST(req: NextRequest) {
  try {
    const clientIP = getClientIP(req);
    if (isRateLimited(clientIP)) {
      return new Response(
        JSON.stringify({
          error:
            'Rate limit exceeded. Please wait before sending another message.',
        }),
        {
          status: 429,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid messages format' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const lastMessage = messages[messages.length - 1]?.content || '';
    const contextualSystemPrompt = buildDynamicContext(lastMessage);

    const result = await streamText({
      model: openai('gpt-3.5-turbo'),
      system: contextualSystemPrompt,
      messages: convertToCoreMessages(messages),
      maxTokens: 400,
      temperature: 0.7,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({
        error:
          'I apologize, but I encountered an error. Please try again in a moment.',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
