const readline = require('node:readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

let cells = [];

const rows = 32;
const colms = 32;

class cell {
    constructor(x, y, alive = false) {
        this.x = x;
        this.y = y;
        this.neighbors = 0;
        this.alive = alive;
        this.nextState = alive;
    }
    count_neighbors(){    
    const neighborOffsets = [
        [-1, -1], [-1, 0], [-1, 1],
        [ 0, -1],          [ 0, 1],
        [ 1, -1], [ 1, 0], [ 1, 1],
    ];        
    this.neighbors = 0;
    neighborOffsets.forEach(([dx, dy]) => {
        const neighbor = cells.find(cel => cel.x === this.x + dx && cel.y === this.y + dy);
        if (neighbor && neighbor.alive) {
          this.neighbors++;
        }})
    }
    calculate_next_state() {
        if (this.alive) {
            this.nextState = !(this.neighbors < 2 || this.neighbors > 3); // Stays alive or dies
        } else {
            this.nextState = this.neighbors === 3; // Becomes alive if exactly 3 neighbors
        }
    }

    apply_next_state() {
        this.alive = this.nextState;
    }
}

function display() {
    console.clear()
    for (let i = 0; i < rows; i++) {
        let rowString = "";
        for (let j = 0; j < colms; j++) {
            if (cells[i * colms + j].alive) {
                rowString += "■";
            } else {
                rowString += "□";
            }
        }
        console.log(rowString);
        
    }
}

function create_grid(rows, colms) {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < colms; j++) {
            let cel = new cell(i,j,false);
            cells.push(cel);
        }
    }
}

function randomize_grid() {
    cells.forEach(cell => {
        cell.alive = Math.random() < 0.5; // 50% chance of being alive
    });
}

create_grid(rows, colms);

randomize_grid();

setInterval(() => {
    cells.forEach(cel => {
        cel.count_neighbors();
        cel.calculate_next_state();
    });

    cells.forEach(cel => {
        cel.apply_next_state();
    })

    display();
},1000)