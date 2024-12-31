type QueuedRequest = {
  id: string;
  request: () => Promise<any>;
  resolve: (value: any) => void;
  reject: (error: any) => void;
};

class RequestQueue {
  private queue: QueuedRequest[] = [];
  private processing = false;

  async add<T>(request: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      const requestId = Math.random().toString(36).substring(7);
      
      this.queue.push({
        id: requestId,
        request,
        resolve,
        reject,
      });

      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.processing || this.queue.length === 0) return;
    this.processing = true;

    while (this.queue.length > 0) {
      const current = this.queue.shift()!;
      try {
        const result = await current.request();
        current.resolve(result);
      } catch (error) {
        current.reject(error);
      }
    }

    this.processing = false;
  }
}

export const globalRequestQueue = new RequestQueue();