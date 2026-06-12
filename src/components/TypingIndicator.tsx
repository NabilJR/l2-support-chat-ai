// src/components/TypingIndicator.tsx
export default function TypingIndicator() {
  return (
    <div className="flex items-center space-x-1 px-4 py-2">
      <span className="sr-only">AI sedang mengetik</span>
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  );
}