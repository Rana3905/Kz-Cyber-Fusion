import { useState, KeyboardEvent } from 'react';

interface AssistantInputProps {
  onSubmit: (question: string) => void;
  disabled?: boolean;
}

const QUICK_QUESTIONS = [
  'Why is this incident critical?',
  'What happened first?',
  'Which evidence is strongest?',
  'What should I do next?',
];

export default function AssistantInput({ onSubmit, disabled }: AssistantInputProps) {
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    if (!value.trim() || disabled) return;
    onSubmit(value.trim());
    setValue('');
  };

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="space-y-3">
      {/* Quick questions */}
      <div className="flex flex-wrap gap-2">
        {QUICK_QUESTIONS.map((q) => (
          <button
            key={q}
            onClick={() => onSubmit(q)}
            disabled={disabled}
            className="font-mono text-xs px-3 py-1.5 rounded-full border border-cyber-border text-gray-400 hover:border-cyber-green/30 hover:text-cyber-green transition-colors disabled:opacity-40"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-3">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask the AI SOC assistant about this incident..."
          rows={2}
          disabled={disabled}
          className="flex-1 bg-cyber-bg border border-cyber-border rounded-lg px-4 py-3 text-sm text-gray-200 placeholder-gray-600 font-mono resize-none focus:outline-none focus:border-cyber-green/40 transition-colors disabled:opacity-40"
        />
        <button
          onClick={handleSubmit}
          disabled={disabled || !value.trim()}
          className="px-5 py-2 rounded-lg bg-cyber-green/10 border border-cyber-green/30 text-cyber-green font-mono text-sm hover:bg-cyber-green/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
        >
          Ask
        </button>
      </div>
    </div>
  );
}
