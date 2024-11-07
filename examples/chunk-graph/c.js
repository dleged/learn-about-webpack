import { COMMON_VAR } from './common';

console.log('c file ', COMMON_VAR);

import('./c1').then(fn => fn());
import('./c2').then(fn => fn());