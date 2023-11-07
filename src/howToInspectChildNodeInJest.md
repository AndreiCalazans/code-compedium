

If you want to profile the Jest test, or the child node that Jest runs you have
to add the inspect flag to the underlying worker:

In node_modules/jest-runner you will have this new worker instantiation, add
--inspect-brk to execArgv to be able to inspect via chrome://inspect
```javascript
    const worker = new (_jestWorker().Worker)(require.resolve('./testWorker'), {
      exposedMethods: ['worker'],
      forkOptions: {
        serialization: 'json',
        stdio: 'pipe',
        execArgv: ['--inspect-brk']
      },
      // The workerIdleMemoryLimit should've been converted to a number during
      // the normalization phase.
      idleMemoryLimit:
        typeof this._globalConfig.workerIdleMemoryLimit === 'number'
          ? this._globalConfig.workerIdleMemoryLimit
          : undefined,
      maxRetries: 3,
      numWorkers: this._globalConfig.maxWorkers,
      setupArgs: [
        {
          serializableResolvers: Array.from(resolvers.values())
        }
      ]
    });
```
