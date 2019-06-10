// @flow weak

import createMixins from './mixins';

export function createAtomicTheme(mode = 'light') {
  const theme = {
    mixins: createMixins()
  };
  return theme;
}

export default createAtomicTheme;
