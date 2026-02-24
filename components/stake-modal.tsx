"use client"

/**
 * Legacy re-export — the canonical StakeModal now lives in
 * components/staking/stake-modal.tsx
 *
 * This wrapper maintains backward compatibility for any import from
 * "@/components/stake-modal".  All new code should import from
 * "@/components/staking" instead.
 */

export { StakeModal } from "@/components/staking/stake-modal";

