import Cell from "./Cell.tsx";

interface BoardProps {
    board: string[];
    onCellClick: (index: number) => void;
    disabled: boolean;
}

function Board({ board, onCellClick, disabled }: BoardProps) {
    return (
        <div className="game-board">
            {board.map((cell, index) => (
                <Cell
                    key={index}
                    value={cell}
                    onClick={() => onCellClick(index)}
                    disabled={disabled || cell !== ""}
                />
            ))}
        </div>
    );
}

export default Board;