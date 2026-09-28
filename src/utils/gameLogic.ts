export function getBoard(state: string): string[] {
  if (!state) {
    return Array(9).fill("");
  }

  try {
    const parsed = JSON.parse(state);

    if (
      Array.isArray(parsed.board) &&
      parsed.board.length === 9
    ) {
      return parsed.board;
    }
  } catch {
    // État invalide
  }

  return Array(9).fill("");
}

export function getWinner(board: string[]): string | null {
  const winningLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of winningLines) {
    if (
      board[a] &&
      board[a] === board[b] &&
      board[a] === board[c]
    ) {
      return board[a];
    }
  }

  return null;
}

export function isDraw(board: string[]): boolean {
  return board.every((cell) => cell !== "");
}