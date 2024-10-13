import { BingoBoardTile, GridPosition } from '../../../data/entities/bingo-board-tile.ts';
import { TileSubmission } from '../../../data/entities/tile-submission.ts';

export interface BingoPlayerAnalysis {
  appUserId: string;
  userName: string;
  lines: number;
  completedCount: number;
  isFullHouse: boolean;
}

export function analyzeUserBingoTiles(bingoTiles: BingoBoardTile[], cardSize = 5): BingoPlayerAnalysis[] {
  if (!bingoTiles || bingoTiles?.length === 0) return [];

  const submissionsGroupedByUser = bingoTiles
    .flatMap(tile => tile.submissions)
    .filter(submission => submission.accepted)
    .reduce((acc, submission) => {
      if (!acc[submission.appUserId]) {
        acc[submission.appUserId] = [];
      }
      acc[submission.appUserId].push(submission);
      return acc;
    }, {} as Record<string, TileSubmission[]>);

  return Object.entries(submissionsGroupedByUser).map(([appUserId, submissions]) => {
    const userTiles = submissions.map(submission => (
      bingoTiles.find(tile =>
        tile.submissions.some(sub => sub.id === submission.id && sub.accepted)
      )?.position
    )).filter(pos => pos !== undefined) as GridPosition[];

    const userName = submissions[0]?.userName || '';

    const rowCount = Array(cardSize).fill(0);
    const colCount = Array(cardSize).fill(0);
    const totalTiles = cardSize * cardSize;

    let filledCount = 0;

    userTiles.forEach(tile => {
      if (tile.row >= 0 && tile.row < cardSize && tile.column >= 0 && tile.column < cardSize) {
        rowCount[tile.row] += 1;
        colCount[tile.column] += 1;
        filledCount += 1;
      }
    });

    const lines = rowCount.filter(count => count === cardSize).length +
      colCount.filter(count => count === cardSize).length;

    const isFullHouse = filledCount === totalTiles;

    return {
      appUserId,
      userName,
      lines,
      completedCount: filledCount,
      isFullHouse
    };
  });
}