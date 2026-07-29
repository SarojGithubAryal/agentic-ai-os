import { providerRegistry } from "../registry/provider-registry.js";
import { ProviderHealth } from "../interfaces/provider.types.js";

export const getProvider = (name: string) => {
  const provider = providerRegistry.get(name);
  if (!provider) {
    throw new Error(`Provider "${name}" not found`);
  }
  return provider;
};

export const listProviders = (): string[] => {
  return providerRegistry.list();
};

export const healthCheckAll = async (): Promise<ProviderHealth[]> => {
  const providers = providerRegistry.list();
  const results = await Promise.allSettled(
    providers.map(async (name) => {
      const provider = providerRegistry.get(name)!;
      return provider.healthCheck();
    })
  );
  return results.map((res, idx) => {
    if (res.status === "fulfilled") return res.value;
    return {
      provider: providers[idx],
      status: "error",
      message: (res.reason as Error)?.message ?? "Unknown error",
    };
  });
};