import * as migration_20260509_152917_init from './20260509_152917_init';
import * as migration_20260514_064821 from './20260514_064821';
import * as migration_20260517_131127 from './20260517_131127';
import * as migration_20260518_035938 from './20260518_035938';
import * as migration_20260730_040234 from './20260730_040234';

export const migrations = [
  {
    up: migration_20260509_152917_init.up,
    down: migration_20260509_152917_init.down,
    name: '20260509_152917_init',
  },
  {
    up: migration_20260514_064821.up,
    down: migration_20260514_064821.down,
    name: '20260514_064821',
  },
  {
    up: migration_20260517_131127.up,
    down: migration_20260517_131127.down,
    name: '20260517_131127',
  },
  {
    up: migration_20260518_035938.up,
    down: migration_20260518_035938.down,
    name: '20260518_035938',
  },
  {
    up: migration_20260730_040234.up,
    down: migration_20260730_040234.down,
    name: '20260730_040234'
  },
];
