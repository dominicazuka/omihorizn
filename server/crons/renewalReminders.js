const subscriptionService = require('../services/subscriptionService');

async function run() {
  console.log('Starting renewal reminder job');
  try {
    const result = await subscriptionService.sendRenewalReminders();
    console.log(`Sent 7-day reminders to ${result.reminded7} users`);
    console.log(`Sent 1-day reminders to ${result.reminded1} users`);
  } catch (err) {
    console.error('Error during renewal reminder job:', err);
  }
}

if (require.main === module) {
  run().then(() => process.exit(0));
}

module.exports = run;
