interface CellProps {
    value: string;
    onClick: () => void;
    disabled: boolean;
}

function Cell({ value, onClick, disabled }: CellProps) {
    return (
        <button
            type="button"
            className="game-cell"
            onClick={onClick}
            disabled={disabled}
        >
            {value}
        </button>
    );
}

export default Cell;