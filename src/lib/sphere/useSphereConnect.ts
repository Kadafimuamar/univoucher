"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import type { SphereConnectState } from '@/types/order';
import { SPHERE_WALLET_URL } from '@/lib/sphere/config';
import { safeErrorMessage } from '@/lib/utils';

type ConnectResult = {
  client: {
    query: (method: string, params?: unknown) => Promise<unknown>;
    intent: (action: string, params?: unknown) => Promise<unknown>;
    on?: (event: string, handler: (data: unknown) => void) => void;
  };
  disconnect: () => Promise<void>;
  connection?: { sessionId?: string };
};

const SESSION_KEY = 'univoucher.sphere.session';

export function useSphereConnect() {
  const resultRef = useRef<ConnectResult | null>(null);
  const [state, setState] = useState<SphereConnectState>({ connected: false, connecting: false });

  const refreshWalletView = useCallback(async () => {
    const result = resultRef.current;
    if (!result) return;

    const [identity, balance, assets] = await Promise.allSettled([
      result.client.query('sphere_getIdentity'),
      result.client.query('sphere_getBalance'),
      result.client.query('sphere_getAssets'),
    ]);

    setState((prev) => ({
      ...prev,
      connected: true,
      connecting: false,
      error: undefined,
      identity: identity.status === 'fulfilled' && identity.value && typeof identity.value === 'object'
        ? (identity.value as SphereConnectState['identity'])
        : prev.identity,
      balance: balance.status === 'fulfilled' ? balance.value : prev.balance,
      assets: assets.status === 'fulfilled' ? assets.value : prev.assets,
    }));
  }, []);

  const connect = useCallback(async (silent = false) => {
    setState((prev) => ({ ...prev, connecting: true, error: undefined }));

    try {
      const [{ autoConnect }, { SPHERE_NETWORKS }] = await Promise.all([
        import('@unicitylabs/sphere-sdk/connect/browser'),
        import('@unicitylabs/sphere-sdk/connect'),
      ]);

      const savedSession = typeof window !== 'undefined' ? window.sessionStorage.getItem(SESSION_KEY) : null;

      const result = await autoConnect({
        dapp: { name: 'UniVoucher', url: window.location.origin },
        walletUrl: SPHERE_WALLET_URL,
        network: SPHERE_NETWORKS.testnet2,
        silent,
        resumeSessionId: savedSession || undefined,
        permissions: [
          'identity:read',
          'balance:read',
          'events:subscribe',
          'transfer:request',
        ],
      });

      resultRef.current = result as ConnectResult;

      if (result.connection?.sessionId) {
        window.sessionStorage.setItem(SESSION_KEY, result.connection.sessionId);
      }

      const client = (result as ConnectResult).client;
      client.on?.('transfer:incoming', () => void refreshWalletView());
      client.on?.('transfer:confirmed', () => void refreshWalletView());
      client.on?.('wallet:locked', () => {
        resultRef.current = null;
        window.sessionStorage.removeItem(SESSION_KEY);
        setState({ connected: false, connecting: false, error: 'Wallet locked.' });
      });

      await refreshWalletView();
    } catch (error) {
      if (!silent) {
        setState({ connected: false, connecting: false, error: safeErrorMessage(error) });
      } else {
        setState((prev) => ({ ...prev, connected: false, connecting: false }));
      }
    }
  }, [refreshWalletView]);

  const disconnect = useCallback(async () => {
    try {
      await resultRef.current?.disconnect();
    } finally {
      resultRef.current = null;
      if (typeof window !== 'undefined') window.sessionStorage.removeItem(SESSION_KEY);
      setState({ connected: false, connecting: false });
    }
  }, []);

  const sendPayment = useCallback(async (params: { to: string; amount: string; coinId: string }) => {
    if (!resultRef.current) throw new Error('Sphere Wallet is not connected.');
    return resultRef.current.client.intent('send', params);
  }, []);

  useEffect(() => {
    void connect(true);
  }, [connect]);

  return {
    ...state,
    connect,
    disconnect,
    refreshWalletView,
    sendPayment,
  };
}
