import { useEffect, useRef, useCallback, useState } from 'react';
import type {
  WorkerRequest,
  WorkerResponse,
  WorkerOperation,
} from '../worker/json.worker';
import type { FormatOptions } from '../lib/json/types';

type PendingResolver = (res: WorkerResponse) => void;

type SendPayload =
  | { type: 'format'; payload: FormatOptions & { input: string } }
  | { type: 'minify'; payload: { input: string } }
  | { type: 'validate'; payload: { input: string } }
  | { type: 'repair'; payload: { input: string; indent?: number | 'tab' } }
  | { type: 'sortKeys'; payload: { input: string; indent?: number | 'tab' } }
  | { type: 'escape'; payload: { input: string } }
  | { type: 'unescape'; payload: { input: string } }
  | { type: 'compact'; payload: { input: string } };

export function useJsonWorker() {
  const workerRef = useRef<Worker | null>(null);
  const pendingRef = useRef<Map<number, PendingResolver>>(new Map());
  const idRef = useRef(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const worker = new Worker(new URL('../worker/json.worker.ts', import.meta.url), { type: 'module' });
    const pending = pendingRef.current;
    workerRef.current = worker;

    worker.onmessage = (e: MessageEvent<WorkerResponse>) => {
      const res = e.data;
      const resolver = pending.get(res.id);
      if (resolver) {
        resolver(res);
        pending.delete(res.id);
      }
    };

    setReady(true);

    return () => {
      worker.terminate();
      pending.clear();
    };
  }, []);

  const send = useCallback((req: SendPayload): Promise<WorkerResponse> => {
    return new Promise((resolve) => {
      if (!workerRef.current) {
        resolve({
          id: -1,
          type: req.type as WorkerOperation,
          ok: false,
          error: 'Worker not ready',
        });
        return;
      }
      const id = ++idRef.current;
      pendingRef.current.set(id, resolve);
      const fullReq = { ...req, id } as WorkerRequest;
      workerRef.current.postMessage(fullReq);
    });
  }, []);

  const format = useCallback(
    (input: string, indent: number | 'tab', sortKeys?: boolean) =>
      send({ type: 'format', payload: { input, indent, sortKeys } }),
    [send]
  );

  const minify = useCallback((input: string) => send({ type: 'minify', payload: { input } }), [send]);

  const validate = useCallback((input: string) => send({ type: 'validate', payload: { input } }), [send]);

  const repair = useCallback(
    (input: string, indent?: number | 'tab') => send({ type: 'repair', payload: { input, indent } }),
    [send]
  );

  const sortKeys = useCallback(
    (input: string, indent?: number | 'tab') => send({ type: 'sortKeys', payload: { input, indent } }),
    [send]
  );

  const escape = useCallback((input: string) => send({ type: 'escape', payload: { input } }), [send]);

  const unescape = useCallback((input: string) => send({ type: 'unescape', payload: { input } }), [send]);

  return { ready, format, minify, validate, repair, sortKeys, escape, unescape };
}

export type { Stats, ErrorPosition } from '../lib/json/types';
