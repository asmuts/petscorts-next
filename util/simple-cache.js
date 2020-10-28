import { camelCase } from "camel-case";

class SimpleCache {
  cache = new Map();

  constructor() {
    if (!SimpleCache.instance) {
      SimpleCache.instance = this;
    }
    return SimpleCache.instance;
  }

  has(key) {
    return this.cache.has(camelCase(key));
  }

  put(key, value) {
    this.cache.set(camelCase(key), value);
  }

  get(key) {
    return this.cache.get(camelCase(key));
  }
}

// singleton
const instance = new SimpleCache();
Object.freeze(instance);

export default instance;
