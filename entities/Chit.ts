import {ArraySchema, Schema, type} from "@colyseus/schema";
import {Block} from "./Block";
import {getRandomNumber, getRandomNumbers} from "../util/RandomGenerator";

export class Chit extends Schema {
  @type([Block])
  firstRow = new ArraySchema<Block>();

  @type([Block])
  secondRow = new ArraySchema<Block>();

  @type([Block])
  thirdRow = new ArraySchema<Block>();

  constructor() {
    super();
  }

  public generate() {
    if (this.firstRow.length <= 0) {
      this.generateFullBoard();
      this.removeRandom(this.firstRow);
      this.removeRandom(this.secondRow);
      this.removeRandom(this.thirdRow);
      this.print()
    }
  }

  private removeRandom(arr) {
    for (let i = 0; i < 4; i++) {
      let randomIndex = getRandomNumber(0, arr.length);
      arr.splice(randomIndex, 1);
    }
  }

  public print() {
    console.log(this.firstRow.map(block => block.value + "" + block.checked));
    console.log(this.secondRow.map(block => block.value + "" + block.checked));
    console.log(this.thirdRow.map(block => block.value + "" + block.checked));
  }

  private generateFullBoard() {
    let low = 1, high = 11;
    while (high <= 91) {
      const random = getRandomNumbers(low, high);
      this.firstRow.push(this.getBlock(random[0]));
      this.secondRow.push(this.getBlock(random[1]));
      this.thirdRow.push(this.getBlock(random[2]));
      low = low + 10;
      high = high + 10;
    }
  }

  private getBlock(value) {
    const block = new Block();
    block.value = value;
    block.checked = false;
    return block;
  }

  public scratch(value) {
    let allRows = this.firstRow.concat(this.secondRow).concat(this.thirdRow);
    const block = allRows.find(block => block.value == value);
    if (block) {
      block.checked = true;
    }
    this.print();
  }

  private isRowScratched(row: ArraySchema<Block>) {
    let unCheckedBlocks = row.filter(block => !block.checked);
    return unCheckedBlocks.length === 0;
  }

  public isAllScratched() {
    return this.isRowScratched(this.firstRow) &&
        this.isRowScratched(this.secondRow) &&
        this.isRowScratched(this.thirdRow);
  }
}