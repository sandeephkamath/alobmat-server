import {ArraySchema, MapSchema, Schema, type} from "@colyseus/schema";
import {Player} from "./entities/Player";
import {TurnEvent} from "./entities/TurnEvent";
import {PlayerResult} from "./entities/PlayerResult";

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

  generateChits() {
    for (let id in this.players) {
      this.players[id].generateChit();
    }
  }

  addNewPlayer(playerId: string, name: string) {
    if (this.activePlayers.indexOf(playerId) < 0) {
      this.activePlayers.push(playerId);
    }
    if (this.activePlayers.length == 1) {
      this.currentPlayerIndex = 0;
      this.currentPlayerId = playerId;
    }
    const player = new Player();
    player.name = name;
    this.players[playerId] = player;
  }

  getInitialTurnEvent(): TurnEvent {
    const nextPlayerId = this.activePlayers[this.currentPlayerIndex];
    const nextPlayerName = this.players[nextPlayerId].name;
    return new TurnEvent(nextPlayerId, nextPlayerName);
  }

  scratchChit(num: number) {
    for (let id in this.players) {
      const player = this.players[id];
      player.scratchChit(num);
      this.copyPlayer(id, player);
    }
    this.pickedNumbers.push(num);
  }

  private copyPlayer(id: string, player: Player) {
    const copyPlayer = new Player();
    copyPlayer.name = player.name;
    copyPlayer.chit = player.chit;
    copyPlayer.winPosition = player.winPosition;
    this.players[id] = copyPlayer;
  }

  getNextTurnEvent(currentId: string, pickedNumber: number) {
    let indexFound = false;
    let lastIndex = this.currentPlayerIndex;
    let pId = "";
    while (indexFound === false) {
      lastIndex = (lastIndex + 1) % this.activePlayers.length;
      pId = this.activePlayers[lastIndex];
      indexFound = !this.players[pId].hasWon();
    }
    this.currentPlayerIndex = lastIndex;
    this.currentPlayerId = this.activePlayers[lastIndex];
    const nextPlayerName = this.players[this.currentPlayerId].name;
    const currentPlayerName = this.players[currentId].name;
    return new TurnEvent(this.currentPlayerId, nextPlayerName, currentId, currentPlayerName, pickedNumber);
  }

  getResults(): Array<PlayerResult> {
    const results: Array<PlayerResult> = [];
    for (let id in this.players) {
      const player = this.players[id];
      if (player.hasWon()) {
        results.push(player.getResult(id));
      } else if (player.didWin()) {
        player.winPosition = this.playersWon + 1;
        this.players[id].winPosition = player.winPosition;
        this.playersWon = player.winPosition;
        results.push(player.getResult(id))
      }
    }
    const lastPlayerResult = this.getLastPlayerResult();
    if (lastPlayerResult) {
      results.push(lastPlayerResult);
    }
    return results;
  }

  private getLastPlayerResult(): PlayerResult {
    if (this.activePlayers.length - 1 === this.playersWon) {
      for (let id in this.players) {
        const player = this.players[id];
        if (player.winPosition < 0) {
          return new PlayerResult(player.name, id, this.activePlayers.length)
        }
      }
    }
    return null;
  }

}