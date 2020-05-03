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

  @type("boolean")
  left = false;

  @type("boolean")
  leftBeforeStart = false;

  public scratchChit(value) {
    this.chit.scratch(value);
  }

  public generateChit() {
    this.chit.generate();
  }

  public didWin() {
    return this.chit.isAllScratched();
  }

  public hasFinished() {
    return this.winPosition > -1 || this.left;
  }

  public getResult(playerId: string): PlayerResult {
    return new PlayerResult(this.name, playerId, this.winPosition);
  }

  public getClone() {
    const copyPlayer = new Player();
    copyPlayer.name = this.name;
    copyPlayer.chit = this.chit;
    copyPlayer.winPosition = this.winPosition;
    copyPlayer.left = this.left;
    return copyPlayer;
  }
}