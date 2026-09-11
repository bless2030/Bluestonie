export default function DepositWithdrawalPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <Header />
      <section className="mx-auto max-w-5xl px-5 py-10 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
          <p className="leading-7 text-slate-600">
            This policy explains the general process for deposits and
            withdrawals on BLUESTONIE Investments. Users should always follow
            the payment and transaction instructions displayed on the platform.
          </p>

          <Policy title="1. Deposits">
            Users should select an available package, review the applicable
            amount and follow the payment instructions provided by the platform.
          </Policy>

          <Policy title="2. Payment Details">
            Users should verify the payment method, account name and payment
            number before sending funds. BLUESTONIE should not be held
            responsible for payments sent using incorrect or unauthorized
            payment information.
          </Policy>

          <Policy title="3. Deposit References">
            Users should enter the correct payment reference or transaction
            number when submitting a deposit request. The reference assists
            with verification.
          </Policy>

          <Policy title="4. Deposit Verification">
            Deposit requests may remain pending while payment information is
            reviewed and matched against the submitted transaction details.
          </Policy>

          <Policy title="5. Processing Time">
            Deposit requests may take up to 48 hours to be reviewed and
            credited after verification, depending on the circumstances of
            the transaction and required checks.
          </Policy>

          <Policy title="6. Pending Deposits">
            A pending deposit has not yet completed the applicable review
            process. Users should avoid submitting duplicate requests for
            the same payment while a request is being reviewed.
          </Policy>

          <Policy title="7. Rejected Deposits">
            A deposit may be rejected where payment information cannot be
            verified, required information is missing, or other applicable
            checks are not satisfied.
          </Policy>

          <Policy title="8. Duplicate or Unidentified Payments">
            Payments that cannot be matched to a valid deposit request may
            require additional verification before any action can be taken.
          </Policy>

          <Policy title="9. Withdrawal Eligibility">
            Withdrawals are subject to the applicable platform rules,
            including available balance, minimum withdrawal requirements,
            fees and account status.
          </Policy>

          <Policy title="10. Withdrawal Requests">
            Users must provide accurate payment information when submitting
            a withdrawal request. Incorrect information may delay processing.
          </Policy>

          <Policy title="11. Withdrawal Fees">
            Applicable withdrawal fees are displayed through the platform
            and may be deducted from the requested withdrawal amount.
          </Policy>

          <Policy title="12. Withdrawal Processing">
            Withdrawal requests may require review before payment is released.
            Processing may take up to 48 hours depending on applicable checks
            and operational circumstances.
          </Policy>

          <Policy title="13. Pending Withdrawals">
            A pending withdrawal represents a request that has been submitted
            but has not yet completed processing.
          </Policy>

          <Policy title="14. Rejected Withdrawals">
            A withdrawal may be rejected where account, payment, verification
            or other applicable requirements are not satisfied.
          </Policy>

          <Policy title="15. Fraud Prevention">
            Transaction monitoring and verification procedures may be used to
            protect users and the platform against suspicious or unauthorized
            activity.
          </Policy>

          <Policy title="16. Policy Changes">
            This policy may be updated when platform procedures, payment
            arrangements or operational requirements change.
          </Policy>
        </div>
      </section>
      <Footer />
    </main>
  );
}

function Header() {
  return (
    <header className="border-b border-slate-800 bg-slate-900">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-6">
        <a href="/" className="text-xl font-extrabold text-white">BLUESTONIE</a>
        <a href="/" className="text-sm font-semibold text-slate-300 hover:text-white">Back to Home</a>
      </div>
      <div className="mx-auto max-w-5xl px-5 pb-10 pt-8 sm:px-6">
        <p className="text-sm font-bold uppercase tracking-wider text-blue-400">BLUESTONIE Investments</p>
        <h1 className="mt-3 text-4xl font-extrabold text-white">Deposit & Withdrawal Policy</h1>
      </div>
    </header>
  );
}

function Policy({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      <p className="mt-3 leading-7 text-slate-600">{children}</p>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-900">
      <div className="mx-auto max-w-7xl px-5 py-8 text-center">
        <p className="font-semibold text-white">BLUESTONIE Investments</p>
        <a href="/" className="mt-3 inline-block text-sm font-semibold text-blue-300">Return to BLUESTONIE</a>
      </div>
    </footer>
  );
}
