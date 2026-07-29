import { IProviderAdapter } from "../interfaces/provider-adapter.interface.js";

class ProviderRegistry {
  private providers: Map<string, IProviderAdapter> = new Map();

  register(provider: IProviderAdapter): void {
    if (this.providers.has(provider.providerName)) {
      throw new Error(`Provider "${provider.providerName}" is already registered.`);
    }
    this.providers.set(provider.providerName, provider);
  }

  get(name: string): IProviderAdapter | undefined {
    return this.providers.get(name);
  }

  list(): string[] {
    return Array.from(this.providers.keys());
  }

  clear(): void {
    this.providers.clear();
  }
}

// Singleton instance
export const providerRegistry = new ProviderRegistry();