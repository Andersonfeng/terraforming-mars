import {expect} from 'chai';
import {BreedingFarms} from '../../../src/server/cards/pathfinders/BreedingFarms';
import {Fish} from '../../../src/server/cards/base/Fish';
import {TestPlayer} from '../../TestPlayer';
import {runAllActions, testGame} from '../../TestingUtils';

describe('BreedingFarms', () => {
  let card: BreedingFarms;
  let player: TestPlayer;
  let fish: Fish;

  beforeEach(() => {
    card = new BreedingFarms();
    [/* game */, player] = testGame(1);
    player.playedCards.push(card);
    fish = new Fish();
    player.popWaitingFor();
  });

  it('canPlay', () => {
    player.tagsForTest = {};
    expect(card.canPlay(player)).is.false;

    player.tagsForTest = {science: 1};
    expect(card.canPlay(player)).is.false;

    player.tagsForTest = {animal: 1};
    expect(card.canPlay(player)).is.false;

    player.tagsForTest = {science: 1, animal: 1};
    expect(card.canPlay(player)).is.true;
  });

  it('play', () => {
    expect(player.getTerraformRating()).eq(14);
    expect(player.game.getTemperature()).eq(-30);

    card.play(player);

    expect(player.getTerraformRating()).eq(15);
    expect(player.game.getTemperature()).eq(-28);
  });

  it('Can act', () => {
    player.plants = 0;
    player.playedCards = [];

    expect(card.canAct(player)).is.false;

    player.plants = 1;
    player.playedCards = [];

    expect(card.canAct(player)).is.false;

    player.plants = 0;
    player.playedCards = [fish];

    expect(card.canAct(player)).is.false;

    player.plants = 1;
    player.playedCards = [fish];

    expect(card.canAct(player)).is.true;
  });

  it('act', () => {
    player.plants = 1;
    fish.resourceCount = 0;
    player.playedCards = [fish];

    player.defer(card.action(player));
    runAllActions(player.game);
    player.getWaitingFor()?.cb([fish]);

    expect(player.plants).eq(0);
    expect(fish.resourceCount).eq(1);
  });
});
