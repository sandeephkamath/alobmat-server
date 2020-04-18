import {ArraySchema, MapSchema, Schema, type} from "@colyseus/schema";
import {Player} from "./entities/Player";

export class GameState extends Schema {

  @type({map: Player})
  players = new MapSchema<Player>();

  @type(["string"])
  activePlayers = new ArraySchema<string>();

  @type("number")
  currentPlayerIndex = 0;

  @type("string")
  currentPlayerId = "";

  @type(["number"])
  pickedNumbers = new ArraySchema<number>();

  @type("number")
  playersWon = 0;

}