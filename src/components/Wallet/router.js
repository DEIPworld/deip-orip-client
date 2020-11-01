import Wallet from '@/components/Wallet/Wallet';

export const WalletRouting = [
  {
    path: '/:account/user-wallet',
    name: 'userWallet',
    component: Wallet
  },
  {
    path: '/:account/group-wallet',
    name: 'groupWallet',
    component: Wallet
  }
];
