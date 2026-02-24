"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { requestAccess, isConnected as checkFreighter } from "@stellar/freighter-api";
import {
  MOCK_CONTRACT_ID,
  STELLAR_BASE_FEE,
  XLM_USD_RATE,
} from "@/lib/constants";
import { formatAddress } from "@/lib/calculations";

export interface ConnectPayload {
  address: string;
  balance: number;
}

export interface TransactionReceipt {
  hash: string;
  ledger: number;
  fee: string;
  from: string;
  to: string;
  amount: number;
  amountXLM: number;
  timestamp: string;
}

interface WalletState {
  isConnected: boolean;
  isConnecting: boolean;
  address: string;
  balance: number;

  connect: () => Promise<void>;
  disconnect: () => void;
  updateBalance: (amount: number) => void;
  sendTransaction: (
    amountUSD: number,
    memo: string,
  ) => Promise<TransactionReceipt>;
}

export const useWallet = create<WalletState>()(
  persist(
    (set) => ({
      isConnected: false,
      isConnecting: false,
      address: "",
      balance: 0,

      connect: async () => {
        set({ isConnecting: true });

        try {
          // 1. Check if installed
          const status = await checkFreighter();
          // Freighter v2 returns an object, v1 returned a boolean. This handles both!
          if (!status || (typeof status === 'object' && !status.isConnected)) {
            alert("Freighter is not installed. Please install the browser extension.");
            return;
          }

          const accessResponse = await requestAccess();
          
          if ((accessResponse as any).error) {
            throw new Error((accessResponse as any).error);
          }

          const publicKey = typeof accessResponse === "string" 
            ? accessResponse 
            : (accessResponse as any).address;

          if (!publicKey) {
            throw new Error("Failed to retrieve public key");
          }
          
          const response = await fetch(
            `https://horizon.stellar.org/accounts/${publicKey}`
          );
          
          if (!response.ok) {
            set({
              isConnected: true,
              address: publicKey,
              balance: 0,
            });
            return;
          }

          const data = await response.json();
          const nativeBalance = data.balances.find(
            (b: any) => b.asset_type === "native"
          )?.balance;

          set({
            isConnected: true,
            address: publicKey,
            balance: parseFloat(nativeBalance ?? "0"),
          });
        } catch (error) {
          console.error("Freighter connect error:", error);
          throw error;
        } finally {
          set({ isConnecting: false });
        }
      },

      disconnect: () =>
        set({
          isConnected: false,
          address: "",
          balance: 0,
          isConnecting: false,
        }),

      updateBalance: (amount) =>
        set((state) => ({
          balance: state.balance + amount,
        })),

      /**
       * Simulates a Stellar transaction. Returns a mock receipt with
       * a realistic tx hash, ledger number, stroops fee, etc.
       * 95 % chance of success, 5 % simulated failure (network congestion).
       */
      sendTransaction: async (amountUSD, memo) => {
        const state = useWallet.getState();
        if (!state.isConnected || !state.address) {
          throw new Error("Wallet not connected");
        }

        const amountXLM = amountUSD / XLM_USD_RATE;

        if (amountXLM > state.balance) {
          throw new Error("Insufficient balance");
        }

        // simulate network latency (1-2 s)
        await new Promise((r) =>
          setTimeout(r, 1000 + Math.random() * 1000),
        );

        // 5 % failure rate
        if (Math.random() < 0.05) {
          const reasons = [
            "Network congestion — try again shortly",
            "Transaction timeout — Stellar Horizon did not respond",
          ];
          throw new Error(
            reasons[Math.floor(Math.random() * reasons.length)],
          );
        }

        // build mock receipt
        const hashBytes = Array.from({ length: 32 }, () =>
          Math.floor(Math.random() * 256)
            .toString(16)
            .padStart(2, "0"),
        ).join("");

        const receipt: TransactionReceipt = {
          hash: hashBytes,
          ledger: 50_000_000 + Math.floor(Math.random() * 1_000_000),
          fee: `${STELLAR_BASE_FEE} stroops (${(STELLAR_BASE_FEE / 10_000_000).toFixed(7)} XLM)`,
          from: state.address,
          to: MOCK_CONTRACT_ID,
          amount: amountUSD,
          amountXLM,
          timestamp: new Date().toISOString(),
        };

        // deduct from wallet
        set((s) => ({ balance: s.balance - amountXLM }));

        return receipt;
      },
    }),
    {
      name: "wallet-storage",
    }
  )
);