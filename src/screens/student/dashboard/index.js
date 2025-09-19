// Dashboard components exports
export { default as GameCard } from './GameCard';
export { default as CompletedGameCard } from './CompletedGameCard';
export { default as GamesSection } from './GamesSection';
export { default as CompletedGamesSection } from './CompletedGamesSection';
export { default as BadgesSection } from './BadgesSection';

// Dashboard hooks exports
export { 
  useDashboardData, 
  useGameHandling, 
  useLogout 
} from './useDashboard';