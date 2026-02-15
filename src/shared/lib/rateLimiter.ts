type QueueItem = {
  fn: () => Promise<unknown>;
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
};

class RateLimiter {
  private queue: QueueItem[] = [];
  private isProcessing = false;
  private minInterval: number;

  constructor(minIntervalMs: number = 1100) {
    this.minInterval = minIntervalMs;
  }

  async add<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue.push({
        fn: fn as () => Promise<unknown>,
        resolve: resolve as (value: unknown) => void,
        reject,
      });

      if (!this.isProcessing) {
        this.processQueue();
      }
    });
  }

  private async processQueue(): Promise<void> {
    if (this.queue.length === 0) {
      this.isProcessing = false;
      return;
    }

    this.isProcessing = true;
    const item = this.queue.shift()!;

    try {
      const result = await item.fn();
      item.resolve(result);
    } catch (error) {
      item.reject(error);
    }

    // Wait before processing the next request
    await new Promise((resolve) => setTimeout(resolve, this.minInterval));
    this.processQueue();
  }
}

export const overpassRateLimiter = new RateLimiter(1100);
export const nominatimRateLimiter = new RateLimiter(1100);
