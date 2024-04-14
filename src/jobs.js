class DeployJobQueue {
  constructor() {
    this._jobs = new Map();
  }

  /**
   * 添加任务
   * @param {() => Promise<void>} createJob
   * @param {string} id
   */
  add(createJob, id) {
    console.log('[JOBS] add job');

    if (!this._jobs.has(id)) {
      console.log('[JOBS] createJob with id =', id);
      const wrappedJOb = createJob().finally(() => {
        this._jobs.delete(id);
      });

      this._jobs.set(id, wrappedJOb);
    } else {
      console.log('[JOBS] exists same job indexed by id, id =', id);
    }
  }
}

export const JOBS = new DeployJobQueue();
