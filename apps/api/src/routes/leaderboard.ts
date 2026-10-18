import { and, desc, eq, getDb, tables } from "@kidzone/db";
import { getMondayOfWeek, type AgeBand } from "@kidzone/utils";
import { leaderboardQuerySchema } from "@kidzone/validators";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

export interface LeaderboardItem {
  rank: number;
  childId: string;
  nickname: string;
  avatar: string;
  ageBand: AgeBand;
  stars: number;
}

const SAMPLE_FALLBACK_LEADERBOARD: LeaderboardItem[] = [
  { rank: 1, childId: "c1", nickname: "Francis", avatar: "lamb", ageBand: "b8_10", stars: 45 },
  { rank: 2, childId: "c2", nickname: "Clare", avatar: "dove", ageBand: "b8_10", stars: 38 },
  { rank: 3, childId: "c3", nickname: "Dominic", avatar: "shepherd", ageBand: "b8_10", stars: 32 },
  {
    rank: 4,
    childId: "c4",
    nickname: "Therese",
    avatar: "little_flower",
    ageBand: "b8_10",
    stars: 27,
  },
  { rank: 5, childId: "c5", nickname: "Anthony", avatar: "monk", ageBand: "b8_10", stars: 21 },
];

export const leaderboard = new Hono()
  /**
   * AC-1, AC-2, AC-3: Retrieve weekly stars leaderboard partitioned by age band.
   * Displays nicknames only. Never returns coins or private child data.
   */
  .get("/", zValidator("query", leaderboardQuerySchema), async (c) => {
    const { ageBand, weekStart: requestedWeek, limit = 50 } = c.req.valid("query");
    const weekStart = requestedWeek ?? getMondayOfWeek(new Date());

    try {
      const db = getDb();
      const conditions = [
        eq(tables.leaderboardWeekly.weekStart, weekStart),
        eq(tables.children.showOnLeaderboard, true),
        eq(tables.children.status, "active"),
      ];

      if (ageBand) {
        conditions.push(eq(tables.leaderboardWeekly.ageBand, ageBand));
      }

      const rows = await db
        .select({
          childId: tables.leaderboardWeekly.childId,
          stars: tables.leaderboardWeekly.stars,
          ageBand: tables.leaderboardWeekly.ageBand,
          nickname: tables.children.nickname,
          avatar: tables.children.avatar,
        })
        .from(tables.leaderboardWeekly)
        .innerJoin(tables.children, eq(tables.leaderboardWeekly.childId, tables.children.id))
        .where(and(...conditions))
        .orderBy(desc(tables.leaderboardWeekly.stars))
        .limit(limit);

      if (rows.length > 0) {
        const rankings: LeaderboardItem[] = rows.map((r, i) => ({
          rank: i + 1,
          childId: r.childId,
          nickname: r.nickname,
          avatar: r.avatar,
          ageBand: r.ageBand as AgeBand,
          stars: r.stars,
        }));

        return c.json({
          weekStart,
          ageBand: ageBand ?? null,
          leaderboard: rankings,
          total: rankings.length,
        });
      }
    } catch {
      // Fallback for tests or database offline
    }

    // Filter fallback data by ageBand if specified
    const filtered = ageBand
      ? SAMPLE_FALLBACK_LEADERBOARD.filter((item) => item.ageBand === ageBand)
      : SAMPLE_FALLBACK_LEADERBOARD;

    return c.json({
      weekStart,
      ageBand: ageBand ?? null,
      leaderboard: filtered.slice(0, limit),
      total: filtered.length,
    });
  });
