"use client";

import { FormEvent, useState } from 'react';
import { parseAgentCommand } from '@/lib/agent';

interface ChatLine {
  role: 'user' | 'agent';
  content: string;
}

export function AgentChat({ onSelectProduct, onShowCatalog, onShowOrders }: {
  onSelectProduct: (productId: string) => void;
  onShowCatalog: () => void;
  onShowOrders: () => void;
}) {
  const [input, setInput] = useState('');
  const [lines, setLines] = useState<ChatLine[]>([
    { role: 'agent', content: 'Try: show catalog, buy steam, buy google play, buy amazon, buy netflix, orders, or wallet status.' },
  ]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = input.trim();
    if (!text) return;

    const action = parseAgentCommand(text);
    setLines((prev) => [...prev, { role: 'user', content: text }, { role: 'agent', content: action.message }]);
    setInput('');

    if (action.type === 'show_catalog') onShowCatalog();
    if (action.type === 'show_orders') onShowOrders();
    if (action.type === 'select_product') onSelectProduct(action.productId);
  }

  return (
    <section className="card chatCard">
      <div className="cardHeader">
        <div>
          <p className="eyebrow">Agent</p>
          <h2>UniVoucher assistant</h2>
        </div>
        <span className="pill">deterministic</span>
      </div>

      <div className="chatLines">
        {lines.map((line, index) => (
          <p key={index} className={`chatLine ${line.role}`}>
            <strong>{line.role === 'user' ? 'You' : 'Agent'}:</strong> {line.content}
          </p>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="chatForm">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Try: buy steam"
        />
        <button type="submit">Send</button>
      </form>
    </section>
  );
}
