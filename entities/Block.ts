import {Schema, type} from "@colyseus/schema";

export class Block extends Schema {
  @type("number")
  value: number = 0;

  @type("boolean")
  checked: boolean = false;
}