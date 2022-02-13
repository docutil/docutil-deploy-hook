class JobSeq {
  constructor() {
    this._jobs = [];
    this._completed = true;
  }

  add(job) {
    this._jobs.push(job);

    if (this._completed) {
      this._completed = false;
      this.run();
    }
  }

  async run() {
    console.log('[JOBS] running');

    for (;;) {
      const job = this._jobs.pop();
      if (!job) {
        console.log('[JOBS] empty job seq');
        break;
      }

      await job();
    }

    this._completed = true;
  }
}

export const JOBS = new JobSeq();
