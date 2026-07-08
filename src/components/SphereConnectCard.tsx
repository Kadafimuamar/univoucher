"use client";

import type { SphereConnectState } from '@/types/order';
import { getPaymentConfigStatus } from '@/lib/sphere/config';

type Props = SphereConnectState & {
  connect: (silent?: boolean) => Promise<void>;
  disconnect: () => Promise<void>;
  refreshWalletView: () => Promise<void>;
};

export function SphereConnectCard(props: Props) {
  const cfg = getPaymentConfigStatus();

  return (
    <section className="card">
      <div className="cardHeader">
        <div>
          <p className="eyebrow">Sphere Connect</p>
          <h2>Wallet</h2>
        </div>
        <span className={props.connected ? 'pill ok' : 'pill'}>
          {props.connected ? 'Connected' : props.connecting ? 'Connecting' : 'Not connected'}
        </span>
      </div>

      <div className="buttonRow">
        <button onClick={() => props.connect(false)} disabled={props.connecting}>
          {props.connected ? 'Reconnect' : 'Connect Sphere Wallet'}
        </button>
        <button className="secondary" onClick={props.refreshWalletView} disabled={!props.connected}>
          Refresh
        </button>
        <button className="secondary" onClick={props.disconnect} disabled={!props.connected}>
          Disconnect
        </button>
      </div>

      {props.error ? <p className="errorText">{props.error}</p> : null}

      <div className="grid2 smallText">
        <div>
          <strong>Direct address</strong>
          <span>{props.identity?.directAddress || '-'}</span>
        </div>
        <div>
          <strong>Nametag</strong>
          <span>{props.identity?.nametag || '-'}</span>
        </div>
        <div>
          <strong>Merchant</strong>
          <span>{cfg.merchantNametag || 'Missing env'}</span>
        </div>
        <div>
          <strong>Coin ID valid</strong>
          <span>{cfg.validCoinId ? `Yes — decimals ${cfg.paymentDecimals}` : 'No — set 64-hex coinId'}</span>
        </div>
      </div>

      <details>
        <summary>Raw balance/assets</summary>
        <pre>{JSON.stringify({ balance: props.balance, assets: props.assets }, null, 2)}</pre>
      </details>
    </section>
  );
}
