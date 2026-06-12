import type { ChatMessage as ChatMessageType } from '@/lib/types';
import ReactMarkdown from 'react-markdown';

interface Props {
  message: ChatMessageType;
  thinkingTime?: number | null;
  showThinking?: boolean;
}

export default function ChatMessage({ message, thinkingTime, showThinking }: Props) {
  const isUser = message.role === 'user';

  const timeStr = new Date(message.timestamp).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-fade-in-up`}>
      <div className="flex flex-col max-w-[80%]">
        <div
          className={`rounded-2xl px-4 py-3 text-[15px] leading-relaxed ${
            isUser
              ? 'bg-zinc-700 text-white rounded-br-none'
              : 'bg-zinc-800 text-zinc-200 rounded-bl-none prose prose-invert prose-sm max-w-none'
          }`}
        >
          {isUser ? (
            message.content
          ) : (
            <ReactMarkdown>{message.content}</ReactMarkdown>
          )}
        </div>

        <div
          className={`flex items-center gap-1 mt-1 text-xs text-gray-500 ${
            isUser ? 'justify-end' : 'justify-start'
          }`}
        >
          <span>{timeStr}</span>
          {showThinking && thinkingTime != null && (
            <span>· AI berpikir {thinkingTime.toFixed(1)} detik</span>
          )}
        </div>
      </div>
    </div>
  );
}