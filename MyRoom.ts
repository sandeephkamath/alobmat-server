import {Client, Room} from "colyseus";
import {GameState} from "./GameState";
import {Player} from "./entities/Player";

export class MyRoom extends Room<GameState> {

  onCreate(options: any) {
    this.setState(new GameState());
  }

  onJoin(client: Client, options: any) {
    console.log(options);
    let playerSessionId = client.sessionId;
    const playerId = this.state.activePlayers.find(id => id === playerSessionId);
    if (!playerId) {
      this.state.activePlayers.push(playerSessionId);
    }
    if (this.state.activePlayers.length == 1) {
      this.state.currentPlayerIndex = 0;
      this.state.currentPlayerId = playerSessionId;
    }
    const player = new Player();
    player.name = options.name;
    this.state.players[playerSessionId] = player;
  }

  onMessage(client: Client, message: any) {
    console.log(message);


    if (message.startGame) {
      for (let id in this.state.players) {
        this.state.players[id].generateChits();
      }
      this.broadcast('start');
      this.state.currentPlayerId = this.state.activePlayers[this.state.currentPlayerIndex];
      const nextPlayerName = this.state.players[this.state.currentPlayerId].name;
      this.broadcast({
        nextTurnPlayerId: this.state.currentPlayerId,
        nextTurnPlayerName: nextPlayerName,
      });

    } else if (message.number) {
      for (let id in this.state.players) {
        const player = this.state.players[id];
        player.scratchChits(message.number);
        this.copyPlayer(id, player);
      }
      this.state.pickedNumbers.push(message.number);
      this.state.currentPlayerIndex = (this.state.currentPlayerIndex + 1) % this.state.activePlayers.length;
      this.state.currentPlayerId = this.state.activePlayers[this.state.currentPlayerIndex];
      const nextPlayerName = this.state.players[this.state.currentPlayerId].name;
      const currentPlayerName = this.state.players[client.sessionId].name;
      this.broadcast({
        currentPlayerId: client.sessionId,
        currentPlayerName: currentPlayerName,
        nextTurnPlayerId: this.state.currentPlayerId,
        nextTurnPlayerName: nextPlayerName,
        pickedNumber: message.number
      });

      const wonResponse = Array<{}>();
      for (let id in this.state.players) {
        const player = this.state.players[id];
        if (player.winPosition > -1) {
          wonResponse.push({name: player.name, position: player.winPosition, playerId: id});
        } else if (player.didWin()) {
          player.winPosition = this.state.playersWon + 1;
          this.state.playersWon = player.winPosition;
          wonResponse.push({name: player.name, position: player.winPosition, playerId: id})
        }
      }
      if (wonResponse.length > 0) {
        if (this.state.activePlayers.length - 1 === this.state.playersWon) {
          for (let id in this.state.players) {
            const player = this.state.players[id];
            if (player.winPosition < 0) {
              wonResponse.push({
                name: player.name,
                playerId: id,
                position: this.state.activePlayers.length
              })
            }
          }
        }
        this.broadcast({event: 'over', positions: wonResponse});
      }
    }
  }

  private copyPlayer(id: string, player: Player) {
    const copyPlayer = new Player();
    copyPlayer.name = player.name;
    copyPlayer.chit = player.chit;
    this.state.players[id] = copyPlayer;
  }

  onLeave(client: Client, consented: boolean) {
  }

  onDispose() {
  }

}
