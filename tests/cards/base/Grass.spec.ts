import {expect} from 'chai';
import {setTemperature} from '../../TestingUtils';
import {Grass} from '../../../src/server/cards/base/Grass';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('Grass', () => {
  let card: Grass;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new Grass();
    [game, player] = testGame(2);
  });

  it('Can not play', () => {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', () => {
    setTemperature(game, -16);
    expect(card.canPlay(player)).is.true;
    card.play(player);

    expect(player.production.plants).to.eq(1);
    expect(player.plants).to.eq(3);
  });
});
