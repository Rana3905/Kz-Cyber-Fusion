import { useEffect, useRef } from 'react';
import { useAssistantStore } from '../../store/assistantStore';
import { askAssistant } from '../../api/assistant';
import { useDemoStore } from '../../store/demoStore';
import AssistantMessageComponent from './AssistantMessage';
import AssistantInput from './AssistantInput';

// Rule-based fallback answers for demo
function getRuleBasedAnswer(question: string, incidentId?: string): string {
  const q = question.toLowerCase();
  if (q.includes('critical') || q.includes('why')) {
    return `Incident ${incidentId || 'KCF-001'} is marked CRITICAL because 6 separate detection modules fired within the same attack window (3 hours). The combined risk score is 97/100. Key factors: phishing SMS was the initial vector, leaked credentials enabled rapid account compromise, and impossible travel confirmed the account takeover was not the victim. This matches the KZ Financial Fraud Attack Chain pattern.`;
  }
  if (q.includes('first') || q.includes('happened')) {
    return 'The attack began with an SMS Blaster — a fake base station broadcasting phishing SMS messages impersonating Kaspi Bank. This is the first event at T-3h. The attacker likely had the victim\'s phone number from the Zaimer.kz breach dataset (2023). The phishing link was clicked approximately 12 minutes after the SMS was sent.';
  }
  if (q.includes('evidence') || q.includes('strongest')) {
    return 'The strongest evidence is the combination of impossible travel (Almaty → Moscow in 12 minutes, physically impossible) plus the C2 beacon traffic. These two signals together confirm: (1) the account was taken over remotely, and (2) the attacker\'s device is actively communicating with a command-and-control server. The IP 185.220.101.47 is a confirmed Tor exit node in threat intelligence databases.';
  }
  if (q.includes('do next') || q.includes('action') || q.includes('recommend')) {
    return 'Immediate actions (next 15 minutes):\n1. Block IP 185.220.101.47 at perimeter firewall\n2. Freeze the affected account — prevent further transactions\n3. Force password reset via out-of-band channel (not SMS)\n4. Notify AFM fraud team with case ID KCF-001\n\nWithin 1 hour:\n5. Pull all transactions from the past 6 hours for review\n6. Contact KZ-CERT for SMS blaster source investigation\n7. File incident report with telecom regulator';
  }
  if (q.includes('phishing')) {
    return 'The phishing score of 94 was triggered by 4 rules: FAKE_BONUS (message promises a 50,000 KZT bonus), LOOKALIKE_DOMAIN (kaspi-bonus-2024.ru mimics kaspi.kz), BRAND_IMPERSONATION (uses Kaspi Bank logos and colors), and URGENCY_LANGUAGE ("срок истекает через 24 часа" — expires in 24 hours). This is a classic SMS phishing kit targeting Kazakh bank customers.';
  }
  return `Analyzing your question about incident ${incidentId || 'KCF-001'}... Based on the correlated signals from 6 detection modules (phishing: 94, leak: 85, anomaly: 91, deepfake: 88, network: 80, logs: 82), this incident represents a coordinated multi-vector financial fraud attack. The Cyber Fusion Engine correlated all signals to the same entity within a 3-hour attack window with 96% confidence. Is there a specific aspect you'd like me to explain in more detail?`;
}

export default function AIAssistant() {
  const { messages, loading, currentIncidentId, addMessage, setLoading } = useAssistantStore();
  const { incident } = useDemoStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  const activeIncidentId = currentIncidentId || incident?.id;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleAsk = async (question: string) => {
    const userMsg = {
      id: crypto.randomUUID(),
      role: 'user' as const,
      content: question,
      timestamp: new Date().toISOString(),
    };
    addMessage(userMsg);
    setLoading(true);

    try {
      const res = await askAssistant({ incident_id: activeIncidentId, question });
      addMessage({
        id: crypto.randomUUID(),
        role: 'assistant',
        content: res.answer,
        timestamp: new Date().toISOString(),
      });
    } catch {
      // Fallback to rule-based
      await new Promise((r) => setTimeout(r, 800));
      addMessage({
        id: crypto.randomUUID(),
        role: 'assistant',
        content: getRuleBasedAnswer(question, activeIncidentId),
        timestamp: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-cyber-card border border-cyber-border rounded-lg flex flex-col" style={{ height: '600px' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-cyber-border">
        <div className="w-8 h-8 rounded-full bg-cyber-green/10 border border-cyber-green/20 flex items-center justify-center text-cyber-green font-mono text-xs font-bold">
          AI
        </div>
        <div>
          <div className="font-mono text-sm text-white font-semibold">AI SOC Assistant</div>
          <div className="text-xs text-gray-500">
            {activeIncidentId ? `Analyzing ${activeIncidentId}` : 'Ready — run demo to load an incident'}
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyber-green animate-pulse-slow" />
          <span className="font-mono text-xs text-cyber-green">ONLINE</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">◆</div>
            <div className="font-mono text-sm text-gray-500 mb-2">AI SOC Assistant ready</div>
            <div className="text-xs text-gray-600">Run the demo or select an incident, then ask questions about the threat.</div>
          </div>
        )}
        {messages.map((msg) => (
          <AssistantMessageComponent key={msg.id} message={msg} />
        ))}
        {loading && (
          <div className="flex items-center gap-3 animate-slide-in">
            <div className="w-7 h-7 rounded-full bg-cyber-green/10 border border-cyber-green/20 flex items-center justify-center text-cyber-green text-xs font-mono shrink-0">
              AI
            </div>
            <div className="bg-cyber-card border border-cyber-border rounded-lg px-4 py-3">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-cyber-green animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-cyber-border">
        <AssistantInput onSubmit={handleAsk} disabled={loading} />
      </div>
    </div>
  );
}
