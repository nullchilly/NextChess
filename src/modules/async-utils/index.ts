export type MaybePromise<T> = T | Promise<T>;

export type ResultT<T> =
  | { ok: true; result: T }
  | { ok: false; reason: unknown };

/**
 * Sleeps for `ms` milliseconds.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function tryUntil<T>({
  run,
  until,
  maxIterations = Number.MAX_SAFE_INTEGER,
  delayBetween = 1000,
}: {
  run: (iteration: number) => MaybePromise<T>;
  until: (value: T) => MaybePromise<boolean>;
  maxIterations?: number;
  delayBetween?: number;
}): Promise<T> {
  let lastError: unknown = undefined;
  for (let iteration = 0; iteration < maxIterations; iteration++) {
    if (iteration !== 0) {
      await sleep(delayBetween);
    }
    try {
      const result = await run(iteration);
      const isValid = await until(result);
      if (isValid) return result;
    } catch (error) {
      lastError = error;
    }
  }
  throw new Error("max iterations reached without success", {
    cause: lastError,
  });
}

/**
 * Use try/catch(/finally) block as an expression
 *
 * This is useful to format the result or reason, especially to provide
 * more meaningful error messages.
 */
export async function try$<T>(
  onTry: () => MaybePromise<T>,
  onCatch: (error: unknown) => MaybePromise<T>,
  onFinally?: () => MaybePromise<void>
): Promise<T> {
  try {
    return await onTry();
  } catch (error) {
    return await onCatch(error);
  } finally {
    onFinally && (await onFinally());
  }
}

/**
 * Use throw statement as an expression
 */
export function throw$(reason: unknown): never {
  throw reason;
}

/**
 * Wraps the result of an async computation in a `ResultT`
 */
export async function tryAsResultT<T>(
  task: () => Promise<T>
): Promise<ResultT<T>> {
  try {
    const result = await task();
    return { ok: true, result };
  } catch (reason) {
    return { ok: false, reason };
  }
}
