import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { ethers } from "ethers";

interface BlockchainContextType {
  account: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  connectWallet: () => Promise<string | null>;
  processPayment: (amountETH: string) => Promise<{ success: boolean; hash?: string; error?: string }>;
}

const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined);

const ADMIN_WALLET = "0x1234567890123456789012345678901234567890"; // Placeholder admin address

export const BlockchainProvider = ({ children }: { children: ReactNode }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    // Check if already connected
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          }
        } catch (err) {
          console.error("Failed to check wallet connection:", err);
        }
      }
    };
    checkConnection();
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return null;
    }

    setIsConnecting(true);
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);
      return accounts[0];
    } catch (err: any) {
      console.error("User rejected wallet connection", err);
      return null;
    } finally {
      setIsConnecting(false);
    }
  };

  const processPayment = async (amountETH: string) => {
    if (!window.ethereum) return { success: false, error: "MetaMask not found" };
    
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      console.log(`Sending ${amountETH} ETH to ${ADMIN_WALLET}...`);
      const tx = await signer.sendTransaction({
        to: ADMIN_WALLET,
        value: ethers.parseEther(amountETH)
      });
      
      console.log("Transaction sent:", tx.hash);
      const receipt = await tx.wait();
      
      if (receipt && receipt.status === 1) {
        return { success: true, hash: tx.hash };
      } else {
        return { success: false, error: "Transaction failed" };
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      return { success: false, error: err.message || "User rejected or insufficient funds" };
    }
  };

  return (
    <BlockchainContext.Provider value={{ account, isConnected: !!account, isConnecting, connectWallet, processPayment }}>
      {children}
    </BlockchainContext.Provider>
  );
};

export const useBlockchain = () => {
  const context = useContext(BlockchainContext);
  if (!context) throw new Error("useBlockchain must be used within BlockchainProvider");
  return context;
};

// Type definition for window.ethereum
declare global {
  interface Window {
    ethereum: any;
  }
}
