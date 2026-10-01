import { createServerFn } from '@tanstack/react-start';

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  avatarUrl?: string;
  totalXp: number;
  quizzesCompleted: number;
  streakDays: number;
  badgeTitle: string;
  lastActive: string;
}

// In-memory persistent demo store initialized with realistic competitors
let leaderboardStore: LeaderboardEntry[] = [
  {
    userId: 'user-1',
    userName: 'Aarav Sharma',
    totalXp: 1850,
    quizzesCompleted: 14,
    streakDays: 7,
    badgeTitle: 'Indus Scholar',
    lastActive: 'Just now',
  },
  {
    userId: 'user-2',
    userName: 'Meera Nair',
    totalXp: 1620,
    quizzesCompleted: 12,
    streakDays: 5,
    badgeTitle: 'Temple Architect',
    lastActive: '2h ago',
  },
  {
    userId: 'user-3',
    userName: 'Kabir Verma',
    totalXp: 1340,
    quizzesCompleted: 10,
    streakDays: 4,
    badgeTitle: 'Fort Historian',
    lastActive: '5h ago',
  },
  {
    userId: 'user-4',
    userName: 'Ananya Roy',
    totalXp: 980,
    quizzesCompleted: 7,
    streakDays: 3,
    badgeTitle: 'Craft Chronicler',
    lastActive: '1d ago',
  },
];

export const getLeaderboard = createServerFn({ method: 'GET' }).handler(async () => {
  // Sort descending by total XP
  const sorted = [...leaderboardStore].sort((a, b) => b.totalXp - a.totalXp);
  return { success: true, leaderboard: sorted };
});

export const submitQuizScore = createServerFn({ method: 'POST' })
  .validator(
    (input: {
      userId: string;
      userName: string;
      earnedXp: number;
      streakDays?: number;
    }) => input
  )
  .handler(async ({ data }) => {
    const { userId, userName, earnedXp, streakDays = 1 } = data;

    let userEntry = leaderboardStore.find((u) => u.userId === userId || u.userName === userName);

    if (userEntry) {
      userEntry.totalXp += earnedXp;
      userEntry.quizzesCompleted += 1;
      userEntry.streakDays = Math.max(userEntry.streakDays, streakDays);
      userEntry.lastActive = 'Just now';
    } else {
      userEntry = {
        userId: userId || `user-${Date.now()}`,
        userName: userName || 'Dharohar Explorer',
        totalXp: earnedXp,
        quizzesCompleted: 1,
        streakDays,
        badgeTitle: earnedXp >= 100 ? 'Heritage Novice' : 'Curious Traveler',
        lastActive: 'Just now',
      };
      leaderboardStore.push(userEntry);
    }

    // Re-rank
    leaderboardStore.sort((a, b) => b.totalXp - a.totalXp);
    const userRank = leaderboardStore.findIndex((u) => u.userId === userEntry!.userId) + 1;

    return {
      success: true,
      entry: userEntry,
      rank: userRank,
      leaderboard: leaderboardStore,
    };
  });
