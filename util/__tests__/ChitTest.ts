import {Chit} from "../../entities/Chit";

describe('Chit', () => {

  it('generate', () => {
    const chit: Chit = new Chit();
    chit.generate();
  });
});