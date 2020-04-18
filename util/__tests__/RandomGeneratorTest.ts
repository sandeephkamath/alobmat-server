import {expect} from 'chai';
import {getRandomNumbers} from "../RandomGenerator";

describe('Random numbers', () => {
  it('get 3 random sorted numbers between 11 and 20', () => {
    const lowerBound = 11;
    const upperBound = 20;
    const result = getRandomNumbers(lowerBound, upperBound);
    expect(result).to.have.lengthOf(3);
    expect(result[0]).to.be.gte(lowerBound).and.lessThan(upperBound);
    expect(result[1]).to.be.gte(lowerBound).and.lessThan(upperBound);
    expect(result[2]).to.be.gte(lowerBound).and.lessThan(upperBound);
    expect(result[0]).to.be.lessThan(result[1]).and.lessThan(result[2]);
    expect(result[1]).to.be.lessThan(result[2]);
  });

  it('get 5 random numbers between 0 and 11', () => {
    const lowerBound = 0;
    const upperBound = 11;
    const result = getRandomNumbers(lowerBound, upperBound, 5);
    expect(result).to.have.lengthOf(5);
  });
});