import {Schema, type} from "@colyseus/schema";
import {Chit} from "./Chit";
import {PlayerResult} from "./PlayerResult";

export class Player extends Schema {
  @type("string")
  name: string = "UN-NAMED";

  @type(Chit)
  chit: Chit = new Chit();

  @type("number")
  winPosition = -1;

  public scratchChit(value) {
    this.chit.scratch(value);
  }

  public generateChit() {
    this.chit.generate();
  }

  public didWin() {
    return this.chit.isAllScratched();
  }

  public hasWon() {
    return this.winPosition > -1;
  }

  public getResult(playerId: string): PlayerResult {
    return new PlayerResult(this.name, playerId, this.winPosition);
  }
}