type Resource = {
  data: ClientKillSwitchConfig;
  promiseState: "pending" | "fulfilled" | "rejected";
  promise?: Promise<void>;
  load: () => void;
  read: () => ClientKillSwitchConfig;
  /* Testing utility */
  reset: () => void;
};

/*
 * ClientKillSwitchResource is a poor man's Suspense cache. To trigger a Suspense fallback
 * it throws a promise.
 *
 * It supports preloading the kill switch resource by calling ClientKillSwitchResource.load.
 * Due to this we must keep track of the promise state.
 *
 * */
export const ClientKillSwitchResource: Resource = {
  data: defaultClientKillSwitchConfig,
  promiseState: "pending",
  promise: undefined,
  load() {
    this.promise = new Promise((resolve) => {
      this.promiseState = "pending";

      initClientKillSwitch(defaultClientKillSwitchConfig, initConfig)
        .then((data) => {
          this.data = data ?? defaultClientKillSwitchConfig;
          this.promiseState = "fulfilled";
        })
        .catch(() => {
          // we don't rethrow bc we fallback to the default in code kill switch config
          this.promiseState = "rejected";
        })
        .finally(() => {
          resolve();
        });
    });
  },
  read() {
    if (this.promiseState !== "pending") {
      return this.data;
    }

    // We hit here if we did not preload ClientKillSwitchResource by calling load before hand.
    if (!this.promise) {
      this.load();
    }

    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw this.promise;
  },
  reset() {
    this.promiseState = "pending";
    this.promise = undefined;
  },
};

/*
 * The idea here you can do Resource.read() to trigger a Suspense fallback or
 *  read from cache.
 *
 *
 *
 * */
