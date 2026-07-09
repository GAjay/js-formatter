import { useEffect, useRef, useCallback, useState } from 'react';
import type { WorkerRequest, WorkerResponse, Stats, ErrorPosition } from '../json.worker';

type PendingResolver = (res: WorkerResponse) => void;

type SendRequest =
  | { type: 'format'; payload: { input: string; indent: number | string } }
  | { type: 'minify'; payload: { input: string } }
  | { type: 'validate'; payload: { input: string } }
  | { type: 'repair'; payload: { input: string } };

export function useJsonWorker() {
  const workerRef = useRef<Worker | null>(null);
  const pendingRef = useRef<Map<number, PendingResolver>>(new Map());
  const idRef = useRef(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const worker = new Worker(new URL('../json.worker.ts', import.meta.url), { type: 'module' });
    workerRef.current = worker;

    worker.onmessage = (e: MessageEvent<WorkerResponse>) => {
      const res = e.data;
      const resolver = pendingRef.current.get(res.id);
      if (resolver) {
        resolver(res);
        pendingRef.current.delete(res.id);
      }
    };

    setReady(true);

    return () => {
      worker.terminate();
      pendingRef.current.clear();
    };
  }, []);

  const send = useCallback((req: SendRequest): Promise<WorkerResponse> => {
    return new Promise((resolve) => {
      if (!workerRef.current) {
        resolve({ id: -1, type: 'format', ok: false, error: 'Worker not ready' } as WorkerResponse);
        return;
      }
      const id = ++idRef.current;
      pendingRef.current.set(id, resolve);
      const fullReq = { ...req, id } as WorkerRequest;
      workerRef.current.postMessage(fullReq);
    });
  }, []);

  const format = useCallback(
    (input: string, indent: number | string) =>
      send({ type: 'format', payload: { input, indent } }),
    [send]
  );

  const minify = useCallback(
    (input: string) => send({ type: 'minify', payload: { input } }),
    [send]
  );

  const validate = useCallback(
    (input: string) => send({ type: 'validate', payload: { input } }),
    [send]
  );

  const repair = useCallback(
    (input: string) => send({ type: 'repair', payload: { input } }),
    [send]
  );

  return { ready, format, minify, validate, repair };
}

export type { Stats, ErrorPosition };
