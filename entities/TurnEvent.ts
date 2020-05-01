export class TurnEvent {

  constructor(public readonly nextTurnPlayerId: string,
              public readonly nextTurnPlayerName: string,
              public readonly currentPlayerId?: string,
              public readonly currentPlayerName?: string,
              public readonly pickedNumber?: Number) {

  }
}