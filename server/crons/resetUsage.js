const subscriptionService = require('../services/subscriptionService');

async function run() {
  console.log('Starting usage reset job');
  try {
    const count = await subscriptionService.resetAllUsage();
    console.log(`Reset usage for ${count} users`);
  } catch (err) {
    console.error('Error during usage reset:', err);
  }
}

if (require.main === module) {
  run().then(() => process.exit(0));
}

module.exports = run;
