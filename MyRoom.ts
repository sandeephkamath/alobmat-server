import {Client, Room} from "colyseus";
import {GameState} from "./GameState";
import {TurnEvent} from "./entities/TurnEvent";

export class MyRoom extends Room<GameState> {

  onCreate(options: any) {
    this.setState(new GameState());
  }

  onJoin(client: Client, options: any) {
    console.log(options);
    this.state.addNewPlayer(client.sessionId, options.name);
  }

  onMessage(client: Client, message: any) {
    console.log(message);
    if (message.startGame) {
      this.lock();
      this.state.start();
      this.broadcast('start');
      const initialTurnEvent: TurnEvent = this.state.getInitialTurnEvent();
      this.broadcast(initialTurnEvent);
    } else if (message.number) {
      const pickedNumber: number = message.number;
      this.state.onNumberPick(pickedNumber);
      const nextTurnEvent: TurnEvent = this.state.getNextTurnEvent(client.sessionId, pickedNumber);
      this.broadcast(nextTurnEvent);
      const results = this.state.getResults();
      if (results && results.length > 0) {
        this.broadcast({event: 'over', positions: results});
      }
    }
  }

  onLeave(client: Client, consented: boolean) {
    this.state.playerLeft(client.sessionId);
    if (this.state.hasStarted()) {
      const results = this.state.getResults();
      if (results && results.length > 0) {
        this.broadcast({event: 'over', positions: results});
      }
    }
  }

  onDispose() {
  }

}
