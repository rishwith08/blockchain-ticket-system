export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  price: number;
  totalTickets: number;
  soldTickets: number;
  bannerUrl: string;
  organizer: string;
}

export interface Ticket {
  id: string;
  eventId: string;
  eventName: string;
  ownerAddress: string;
  txHash: string;
  isUsed: boolean;
  purchaseDate: string;
}

export const mockEvents: Event[] = [
  {
    id: "evt-001",
    title: "ETHGlobal Bangkok 2026",
    description: "The largest Ethereum hackathon in Southeast Asia. Three days of building, workshops, and keynotes from leading Web3 builders.",
    date: "2026-04-15",
    time: "09:00",
    location: "Queen Sirikit National Convention Center, Bangkok",
    price: 0.05,
    totalTickets: 2000,
    soldTickets: 1847,
    bannerUrl: "",
    organizer: "ETHGlobal",
  },
  {
    id: "evt-002",
    title: "Devconnect Istanbul",
    description: "A week-long gathering for Ethereum builders featuring independent events, workshops, and community sessions.",
    date: "2026-05-20",
    time: "10:00",
    location: "Istanbul Congress Center, Turkey",
    price: 0.02,
    totalTickets: 5000,
    soldTickets: 3210,
    bannerUrl: "",
    organizer: "Ethereum Foundation",
  },
  {
    id: "evt-003",
    title: "Consensus 2026",
    description: "The world's largest and most influential gathering in crypto and Web3, featuring industry leaders and innovators.",
    date: "2026-06-10",
    time: "08:00",
    location: "Austin Convention Center, Texas",
    price: 0.15,
    totalTickets: 10000,
    soldTickets: 7500,
    bannerUrl: "",
    organizer: "CoinDesk",
  },
  {
    id: "evt-004",
    title: "ZK Summit XII",
    description: "Deep-dive into zero-knowledge proof technology. Workshops on PLONK, Halo2, and applied ZK circuits.",
    date: "2026-07-05",
    time: "09:00",
    location: "Lisbon Convention Center, Portugal",
    price: 0.08,
    totalTickets: 800,
    soldTickets: 650,
    bannerUrl: "",
    organizer: "ZK Foundation",
  },
  {
    id: "evt-005",
    title: "NFT.NYC After Party",
    description: "The official after party featuring live music, art installations, and exclusive NFT drops.",
    date: "2026-04-22",
    time: "20:00",
    location: "Brooklyn Mirage, New York",
    price: 0.03,
    totalTickets: 1500,
    soldTickets: 1500,
    bannerUrl: "",
    organizer: "NFT.NYC",
  },
  {
    id: "evt-006",
    title: "DeFi Security Conference",
    description: "Two days focused on smart contract auditing, MEV prevention, and DeFi protocol security best practices.",
    date: "2026-08-12",
    time: "09:00",
    location: "Berlin Congress Center, Germany",
    price: 0.1,
    totalTickets: 600,
    soldTickets: 289,
    bannerUrl: "",
    organizer: "OpenZeppelin",
  },
];

export const mockTickets: Ticket[] = [
  {
    id: "000001",
    eventId: "evt-001",
    eventName: "ETHGlobal Bangkok 2026",
    ownerAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD38",
    txHash: "0x8a3b7d2e1f4c5a6b9d0e3f2a1b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2",
    isUsed: false,
    purchaseDate: "2026-03-10",
  },
  {
    id: "000002",
    eventId: "evt-002",
    eventName: "Devconnect Istanbul",
    ownerAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD38",
    txHash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2",
    isUsed: true,
    purchaseDate: "2026-03-12",
  },
  {
    id: "000003",
    eventId: "evt-003",
    eventName: "Consensus 2026",
    ownerAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD38",
    txHash: "0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c",
    isUsed: false,
    purchaseDate: "2026-03-14",
  },
];

export const mockWalletAddress = "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD38";
