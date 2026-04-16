import * as basketball from './basketball';
import * as football from './football';

export const sportsConfig = {
  basketball: {
    getStatsByPlayer: basketball.getStatsByPlayer,
    statMapping: basketball.basketballStatMapping,
  },
  football: {
    getStatsByPlayer: football.getStatsByPlayer,
    statMapping: football.footballStatMapping,
  },
};