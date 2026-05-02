import { db } from '@/lib/db/client';

export type AchievementBadge = { id: string; label: string; description: string };

function badgesFromCounts(input: {
  reflectionCount: number;
  homeworkCount: number;
  commentCount: number;
  pinnedCount: number;
}): AchievementBadge[] {
  const badges: AchievementBadge[] = [];

  if (input.reflectionCount >= 1) {
    badges.push({
      id: 'first-reflection',
      label: 'First reflection',
      description: 'Saved a personal reflection on an event.',
    });
  }
  if (input.reflectionCount >= 5) {
    badges.push({
      id: 'reflective-reader',
      label: 'Reflective reader',
      description: 'Saved reflections for five events.',
    });
  }
  if (input.homeworkCount >= 1) {
    badges.push({
      id: 'first-homework',
      label: 'First submission',
      description: 'Uploaded your first homework.',
    });
  }
  if (input.homeworkCount >= 3) {
    badges.push({
      id: 'committed-learner',
      label: 'Committed learner',
      description: 'Three homework submissions logged.',
    });
  }
  if (input.commentCount >= 1) {
    badges.push({
      id: 'community-voice',
      label: 'Community voice',
      description: 'Left your first comment on someone’s work.',
    });
  }
  if (input.pinnedCount >= 3) {
    badges.push({
      id: 'curator',
      label: 'Curator',
      description: 'Pinned three pieces you want to revisit.',
    });
  }

  return badges;
}

export async function getDashboardStatsForUser(userId: string) {
  const [reflectionCount, homeworkCount, commentCount, pinnedCount] = await Promise.all([
    db.personalReflection.count({ where: { userId } }),
    db.homeworkSubmission.count({
      where: { userId, deletedAt: null },
    }),
    db.homeworkComment.count({ where: { userId } }),
    db.homeworkPin.count({ where: { userId } }),
  ]);

  const achievements = badgesFromCounts({
    reflectionCount,
    homeworkCount,
    commentCount,
    pinnedCount,
  });

  const progressPct = Math.min(
    100,
    reflectionCount * 8 + homeworkCount * 12 + Math.min(commentCount, 10) * 4
  );

  return {
    reflectionCount,
    homeworkCount,
    commentCount,
    pinnedCount,
    progressPct,
    achievements,
  };
}
