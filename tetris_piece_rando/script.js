
// A piece defines the visibility of blocks for its shape and its name. A shape is a array of 2 strings of 4 chars. 1 is visible, 0 is hidden.
const pieces =  [
    {
        name: 'I',
        shape: [
            '1111',
            '0000'
        ]
    },
    {
        name: 'O',
        shape: [
            '0110',
            '0110'
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

// Grid of 2 by 4 block elements. Can display a piece.
class Grid {
    constructor() {
        this.div = document.createElement('div');
        this.grid = [];

        const rows = 2;
        const cols = 4;
        for (let i = 0; i < rows; i++) {
            const grid_row = [];
            const div_row = document.createElement('div');
            for (let j = 0; j < cols; j++) {
                const block = document.createElement('div');
                block.className = 'block';
                grid_row.push(block);
                div_row.appendChild(block);
            }
            this.grid.push(grid_row);
            this.div.appendChild(div_row);
        }
        this.div.className = 'grid';
    }

    // Displays a given piece in the grid. To display a piece specific blocks will be made visible.
    showPiece(piece) {
        for (let i = 0; i < this.grid.length; i++) {
            const row = this.grid[i];
            for (let j = 0; j < row.length; j++) {
                const block = row[j];
                const shape = piece.shape;
                const is_block_visible = shape[i].charAt(j) == '1';
                block.style.visibility = is_block_visible ? 'visible' : 'hidden';
                block.className = 'block ' + piece.name;
            }
        }
    }

    remove() {
        this.div.remove();
    }
}

// Changes the piece in the given grid.
class PieceChanger {
    constructor(grid, getSeed) {
        this.grid = grid;
        this.getSeed = getSeed;
        this.rng = undefined;
        this.current_pieces = [];
        this.last_piece = undefined;
    }

    showNext() {
        if (this.last_piece !== undefined) {
            history.add(this.last_piece);
        }

        // Use a shuffled bag of pieces till current bag is empty (7 pieces rule)
        if (this.current_pieces.length == 0) {
            this.current_pieces = [...pieces];
            this.shuffle(this.current_pieces);
            console.log('new bag');
        }
        const next = this.current_pieces.pop();
        console.log(next.name);
        this.grid.showPiece(next);
        this.last_piece = next;
    }

    /**
     * Shuffles array in place. ES6 version
     * @param {Array} a items An array containing the items.
     */
    shuffle(a) {
        if (this.rng == undefined) {
            var seed = this.getSeed();
            if (seed == '') {
                seed = Math.random().toString();
            }
            console.log('used seed:', seed);
            this.rng = new RNG(seed);
        }
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(this.rng.rand() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }
}

// Random number generator with seed
class RNG {
    // https://stackoverflow.com/a/47593316
    constructor(seed_string) {
        // Create xmur3 state:
        var seed = this.xmur3(seed_string);
        // Output one 32-bit hash to provide the seed for mulberry32.
        this.rand = this.mulberry32(seed());
    }

    xmur3(str) {
        for(var i = 0, h = 1779033703 ^ str.length; i < str.length; i++)
            h = Math.imul(h ^ str.charCodeAt(i), 3432918353),
            h = h << 13 | h >>> 19;
        return function() {
            h = Math.imul(h ^ h >>> 16, 2246822507);
            h = Math.imul(h ^ h >>> 13, 3266489909);
            return (h ^= h >>> 16) >>> 0;
        }
    }

    mulberry32(a) {
        return function() {
          var t = a += 0x6D2B79F5;
          t = Math.imul(t ^ t >>> 15, t | 1);
          t ^= t + Math.imul(t ^ t >>> 7, t | 61);
          return ((t ^ t >>> 14) >>> 0) / 4294967296;
        }
    }
}

// History manages a set number of grids for pieces
class History {
    constructor(parent_div, depth) {
        this.parent_div = parent_div;
        this.depth = depth;
        this.grids = [];
    }

    // Adds piece to history. If full removes oldest.
    add(piece) {
        if (this.grids.length >= this.depth) {
            const oldest = this.grids.pop();
            oldest.remove();
        }

        const grid = new Grid(this.parent_div);
        grid.showPiece(piece);
        this.parent_div.prepend(grid.div);
        this.grids.unshift(grid);
    }
}

// --- SETUP ---

const url = new URL(window.location.href);
const seed = url.searchParams.get('seed');
const seed_input = document.getElementById('seed_input');
seed_input.value = seed;
seed_input.onchange = function() {
    window.history.replaceState(null, null, '?seed=' + seed_input.value);
};

const main_grid = new Grid();
const next_piece_div = document.getElementById('piece');
next_piece_div.appendChild(main_grid.div)

const history_div = document.getElementById('history');
const history = new History(history_div, depth=200);

const getSeed = function() { return seed_input.value; };
const piece_changer = new PieceChanger(main_grid, getSeed);

// register click handler on everything. MORE IS ALWAYS BETTER!
const next_piece_button = document.getElementById('next_button');
next_piece_div.onclick = next_piece_button.onclick = history_div.onclick = function() { piece_changer.showNext(); };
