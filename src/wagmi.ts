import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { localhost } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'RainbowKit demo',
  projectId: 'YOUR_PROJECT_ID',
  chains: [localhost],
});
