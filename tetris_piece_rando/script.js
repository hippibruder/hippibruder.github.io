
// Creates a grid of 2 by 4 block elements in the div element.
function setupGrid(div) {
    const rows = 2;
    const cols = 4;
    const grid = [];
    for (let i = 0; i < rows; i++) {
        const grid_row = [];
        const div_row = document.createElement('div');
        for (let j = 0; j < cols; j++) {
            const block = document.createElement('div');
            block.className = 'block';
            grid_row.push(block);
            div_row.appendChild(block);
        }
        grid.push(grid_row);
        div.appendChild(div_row);
    }
    return grid;
}

// Displays a given piece in the grid. To display a piece specific blocks will be made visible.
function showPiece(gird, piece) {
    for (let i = 0; i < grid.length; i++) {
        const row = grid[i];
        for (let j = 0; j < row.length; j++) {
            const block = row[j];
            const shape = piece.shape;
            const is_block_visible = shape[i].charAt(j) == '1';
            block.style.visibility = is_block_visible ? 'visible' : 'hidden';
            block.className = 'block ' + piece.name;
        }
    }
}

// Creates function which changes the pieces in the given grid.
function changePiece(grid) {
    // A piece defines the visibility of blocks for its shape and its name. A shape is a array of 2 strings of 4 chars. 1 is visible, 0 is hidden.
    const pieces =  [
        {
            name: 'I',
            shape: [
                '0000',
                '1111'
            ]
        },
        {
            name: 'O',
            shape: [
                '1100',
                '1100'
            ]
        },
        {
            name: 'T',
            shape: [
                '0100',
                '1110'
            ]
        },
        {
            name: 'S',
            shape: [
                '0110',
                '1100'
            ]
        },
        {
            name: 'Z',
            shape: [
                '1100',
                '0110'
            ]
        },
        {
            name: 'J',
            shape: [
                '1000',
                '1110'
            ]
        },
        {
            name: 'L',
            shape: [
                '0010',
                '1110'
            ]
        },
    ];
    var current_pieces = [];

    return function(){
        // Use a shuffled bag of pieces till current bag is empty (7 pieces rule)
        if (current_pieces.length == 0) {
            current_pieces = [...pieces];
            shuffle(current_pieces);
        }
        const next = current_pieces.pop();
        console.log(next);
        showPiece(grid, next);
    }
}

/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}


// --- SETUP ---
const next_piece_div = document.getElementById('piece');
const next_piece_button = document.getElementById('next_button');

const grid = setupGrid(next_piece_div);

next_piece_div.onclick = next_piece_button.onclick = changePiece(grid);
next_piece_div.onclick();
