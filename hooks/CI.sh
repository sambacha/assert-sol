#!/usr/bin/env node

const { execSync } = require('child_process');
const { runCoverage } = require('@openzeppelin/test-environment');

async function main () {
  await runCoverage(
    ['mocks'],
    'npm run compile',
    './node_modules/.bin/mocha --exit --timeout 10000 --recursive'.split(' '),
  );

  if (process.env.CI) {
    execSync('curl -s https://codecov.io/bash | bash -s -- -C "$GIT_REF"', { stdio: 'inherit' });
  }
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
