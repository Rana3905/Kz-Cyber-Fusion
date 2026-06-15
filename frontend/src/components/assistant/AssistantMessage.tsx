import { AssistantMessage as IAssistantMessage } from '../../types/assistant';
import { formatTime } from '../../utils/formatters';

interface AssistantMessageProps {
  message: IAssistantMessage;
}

export default function AssistantMessage({ message }: AssistantMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-slide-in`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-cyber-green/10 border border-cyber-green/20 flex items-center justify-center text-cyber-green text-xs font-mono shrink-0 mt-1 mr-3">
          AI
        </div>
      )}
      <div className={`max-w-[80%] ${isUser ? 'order-first' : ''}`}>
        <div
          className={`rounded-lg px-4 py-3 text-sm ${
            isUser
              ? 'bg-cyber-green/10 border border-cyber-green/20 text-gray-200 ml-auto'
              : 'bg-cyber-card border border-cyber-border text-gray-200'
          }`}
        >
          {message.content}
        </div>
        <div className={`font-mono text-xs text-gray-600 mt-1 ${isUser ? 'text-right' : ''}`}>
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
}
