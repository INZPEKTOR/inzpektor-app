import { z } from "zod";

const envSchema = z.object({
  PUBLIC_STELLAR_NETWORK: z.enum([
    "PUBLIC",
    "FUTURENET",
    "TESTNET",
    "LOCAL",
    "STANDALONE", // deprecated in favor of LOCAL
  ] as const),
  PUBLIC_STELLAR_RPC_URL: z.string(),
  PUBLIC_STELLAR_HORIZON_URL: z.string().optional(),
});

const parsed = envSchema.safeParse(import.meta.env);

const env: z.infer<typeof envSchema> = parsed.success
  ? parsed.data
  : {
      PUBLIC_STELLAR_NETWORK: "LOCAL",
      PUBLIC_STELLAR_RPC_URL: "http://localhost:8000/rpc",
      PUBLIC_STELLAR_HORIZON_URL: "http://localhost:8000",
    };

export const stellarNetwork =
  env.PUBLIC_STELLAR_NETWORK === "STANDALONE"
    ? "LOCAL"
    : env.PUBLIC_STELLAR_NETWORK;

// NOTE: needs to be exported for contract files in this directory
// Ensure localhost is used for LOCAL network, even if env vars point elsewhere
export const rpcUrl = stellarNetwork === "LOCAL"
  ? "http://localhost:8000/rpc"
  : env.PUBLIC_STELLAR_RPC_URL;

export const horizonUrl = stellarNetwork === "LOCAL"
  ? "http://localhost:8000"
  : env.PUBLIC_STELLAR_HORIZON_URL || "https://horizon-testnet.stellar.org";

export const networkPassphrase = (() => {
  switch (stellarNetwork) {
    case "PUBLIC":
      return "Public Global Stellar Network ; September 2015";
    case "TESTNET":
      return "Test SDF Network ; September 2015";
    case "FUTURENET":
      return "Test SDF Future Network ; October 2022";
    case "LOCAL":
      return "Standalone Network ; February 2017";
    default:
      return "Test SDF Network ; September 2015";
  }
})();
