import * as migration_20260509_152917_init from './20260509_152917_init';

export const migrations = [
  {
    up: migration_20260509_152917_init.up,
    down: migration_20260509_152917_init.down,
    name: '20260509_152917_init'
  },
];
