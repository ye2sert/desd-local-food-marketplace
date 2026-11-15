// Payment decision for the simulated payment service (PW5 / US6).
// AI-assisted code; reviewed and understood by the team.

// Sprint 2: every payment succeeds.
// Sprint 3 will add "DECLINED" and the PAYMENT_SERVICE_UNAVAILABLE error here.
function decidePayment(amount) {
  return {
    paymentStatus: 'SUCCESS',
    transactionId: `TXN-${Date.now()}`,
  };
}

module.exports = { decidePayment };
