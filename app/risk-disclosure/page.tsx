export default function RiskDisclosurePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <Header />
      <section className="mx-auto max-w-5xl px-5 py-10 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
          <p className="leading-7 text-slate-600">
            Financial and investment-related activities involve risks.
            This Risk Disclosure is intended to help users understand that
            past results, displayed balances or expected returns should not
            automatically be interpreted as guarantees of future outcomes.
          </p>

          <Policy title="1. General Risk Warning">
            Users should carefully consider whether an investment-related
            service is appropriate for their financial circumstances and
            objectives before committing funds.
          </Policy>

          <Policy title="2. Investment Risk">
            The value or availability of funds associated with investment
            activities can be affected by a variety of financial, operational,
            economic and other factors.
          </Policy>

          <Policy title="3. Return Risk">
            Any return, rate or projected outcome displayed by the platform
            is subject to the terms applicable to the relevant service and
            should not be treated as an unconditional promise of future
            performance.
          </Policy>

          <Policy title="4. Liquidity and Withdrawal Risk">
            Withdrawals may be subject to minimum amounts, fees, verification,
            processing times and other platform conditions.
          </Policy>

          <Policy title="5. Operational Risk">
            Transactions and services can be affected by operational problems,
            processing errors, interruptions or other unexpected events.
          </Policy>

          <Policy title="6. Technology Risk">
            Online services depend on internet connectivity, software,
            hosting infrastructure and other technologies. Temporary
            interruptions may occur.
          </Policy>

          <Policy title="7. Cybersecurity Risk">
            Although security measures may be implemented, no online system
            can be guaranteed to be completely immune from every possible
            security threat.
          </Policy>

          <Policy title="8. Payment Risk">
            Payment processing may involve external financial or payment
            service providers. Users should verify payment instructions
            before sending funds.
          </Policy>

          <Policy title="9. Currency Risk">
            Where amounts are displayed in more than one currency, exchange
            rates can change. Currency conversions may therefore result in
            different values at different times.
          </Policy>

          <Policy title="10. Legal and Regulatory Risk">
            Laws and regulatory requirements may differ between countries
            and may change over time. Users are responsible for understanding
            the requirements applicable to them.
          </Policy>

          <Policy title="11. No Guaranteed Outcome">
            Users should not commit money they cannot afford to lose and
            should not rely solely on projected or displayed returns when
            making financial decisions.
          </Policy>

          <Policy title="12. User Responsibility">
            Users are responsible for evaluating their own circumstances and,
            where appropriate, obtaining independent financial, legal or
            professional advice.
          </Policy>

          <Policy title="13. Acknowledgement">
            By using BLUESTONIE Investments, users acknowledge that they have
            reviewed the risks associated with the services they choose to
            use and accept responsibility for their own decisions.
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
        <h1 className="mt-3 text-4xl font-extrabold text-white">Risk Disclosure</h1>
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
