class DeployJobQueue {
  constructor() {
    this._jobs = [];
    this._completed = true;
  }

  add(job) {
    console.log('[JOBS] add job');

    this._jobs.push(job);
    if (this._completed) {
      console.log('[JOBS] start parser');
      this._completed = false;
      this.run();
    }
  }

  async run() {
    for (;;) {
      const job = this._jobs.pop();
      if (!job) {
        console.log('[JOBS] empty job queue');
        console.log('[JOBS] shutdown parser');
        break;
      }

      console.log('[JOBS] take job');
      console.log('[JOBS] running');
      await job();
    }

    this._completed = true;
  }
}

export const JOBS = new DeployJobQueue();
