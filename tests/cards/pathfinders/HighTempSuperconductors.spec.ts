import {expect} from 'chai';
import {HighTempSuperconductors} from '../../../src/server/cards/pathfinders/HighTempSuperconductors';
import {Thorgate} from '../../../src/server/cards/corporation/Thorgate';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {Reds} from '../../../src/server/turmoil/parties/Reds';
import {Kelvinists, KELVINISTS_POLICY_1} from '../../../src/server/turmoil/parties/Kelvinists';
import {Turmoil} from '../../../src/server/turmoil/Turmoil';
import {fakeCard, setRulingParty} from '../../TestingUtils';
import {Units} from '../../../src/common/Units';
import {Tag} from '../../../src/common/cards/Tag';
import {PowerPlantStandardProject} from '../../../src/server/cards/base/standardProjects/PowerPlantStandardProject';
import {PartyName} from '../../../src/common/turmoil/PartyName';

describe('HighTempSuperconductors', () => {
  let card: HighTempSuperconductors;
  let player: TestPlayer;
  let game: IGame;
  let turmoil: Turmoil;

  beforeEach(() => {
    card = new HighTempSuperconductors();
    [game, player] = testGame(1, {turmoilExtension: true});
    turmoil = Turmoil.getTurmoil(game);
  });

  it('canPlay', () => {
    player.megaCredits = card.cost;
    turmoil.rulingParty = new Reds();
    expect(player.canPlay(card)).is.false;
    turmoil.rulingParty = new Kelvinists();
    expect(player.canPlay(card)).is.true;
  });

  it('play', () => {
    card.play(player);
    expect(player.production.asUnits()).deep.eq(Units.of({energy: 2}));
  });

  it('discount power tag', () => {
    player.playedCards.push(card);

    // Not power tag
    const cost10 = fakeCard({cost: 10, tags: [Tag.CITY]});
    player.megaCredits = 9;
    expect(player.canPlay(cost10)).is.false;
    player.megaCredits = 10;
    expect(player.canPlay(cost10)).is.true;

    const cost10WithTag = fakeCard({cost: 10, tags: [Tag.POWER]});
    player.megaCredits = 6;
    expect(player.canPlay(cost10WithTag)).is.false;
    player.megaCredits = 7;
    expect(player.canPlay(cost10WithTag)).is.true;
  });

  it('discount standard project', () => {
    player.playedCards.push(card);

    const powerPlant = new PowerPlantStandardProject();
    player.megaCredits = powerPlant.cost - 4;
    expect(powerPlant.canAct(player)).is.false;
    player.megaCredits++;
    expect(powerPlant.canAct(player)).is.true;
  });


  it('double-discount with Thorgate', () => {
    player.playedCards.push(card);
    player.corporations.push(new Thorgate());

    const powerPlant = new PowerPlantStandardProject();
    player.megaCredits = powerPlant.cost - 7;
    expect(powerPlant.canAct(player)).is.false;
    player.megaCredits++;
    expect(powerPlant.canAct(player)).is.true;
  });

  it('discount Kelvinists ruling bonus', () => {
    setRulingParty(game, PartyName.KELVINISTS);

    player.megaCredits = 9;
    expect(KELVINISTS_POLICY_1.canAct(player)).is.false;
    player.megaCredits = 10;
    expect(KELVINISTS_POLICY_1.canAct(player)).is.true;
    expect(KELVINISTS_POLICY_1.description(player)).matches(/10 M/);

    player.playedCards.push(card);
    expect(KELVINISTS_POLICY_1.description(player)).matches(/7 M/);

    player.megaCredits = 6;
    expect(KELVINISTS_POLICY_1.canAct(player)).is.false;
    player.megaCredits = 7;
    expect(KELVINISTS_POLICY_1.canAct(player)).is.true;
  });
});
