import {Schema, type} from "@colyseus/schema";
import {Chit} from "./Chit";

export class Player extends Schema {
  @type("string")
  name: string = "UN-NAMED";

  @type(Chit)
  chit: Chit = new Chit();

  @type("number")
  winPosition = -1;

  public scratchChits(value) {
    this.chit.scratch(value);
  }

  public generateChits() {
    this.chit.generate();
  }

  public didWin() {
    return this.chit.isAllScratched();
  }
}