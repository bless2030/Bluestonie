export default function SupportPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <Header />
      <section className="mx-auto max-w-5xl px-5 py-10 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
          <p className="text-lg leading-8 text-slate-600">
            Welcome to BLUESTONIE Support. This page provides guidance on
            common account, transaction and platform questions and explains
            how users can request assistance.
          </p>

          <Policy title="1. Account Assistance">
            Support can assist with general account-related questions,
            registration issues, verification concerns and difficulties
            accessing platform features.
          </Policy>

          <Policy title="2. Deposits">
            If you have submitted a deposit and it remains pending, provide
            the relevant transaction reference and other requested information
            when contacting support.
          </Policy>

          <Policy title="3. Withdrawals">
            For withdrawal questions, provide the relevant request details
            so that the support team can identify the transaction and
            determine its current status.
          </Policy>

          <Policy title="4. Investment Packages">
            Users should review the package information displayed on the
            platform before making a selection. Support can assist with
            questions about how the package information is presented.
          </Policy>

          <Policy title="5. Daily Activities">
            If a daily activity does not appear correctly or you experience
            difficulty completing an activity, provide the relevant details
            when contacting support.
          </Policy>

          <Policy title="6. Referral Programme">
            Questions concerning referral relationships, qualifying activity
            or commission status should include the relevant referral
            information where available.
          </Policy>

          <Policy title="7. Security Concerns">
            If you believe that your account has been accessed without
            authorization, contact support as soon as possible and change
            your password where appropriate.
          </Policy>

          <Policy title="8. Technical Problems">
            When reporting a technical problem, describe what happened,
            which page was affected and what you expected to happen.
            Screenshots may be useful where appropriate.
          </Policy>

          <Policy title="9. Information to Include">
            A useful support request may include your registered email,
            transaction reference, approximate time of the issue and a clear
            description of the problem. Never send your password or private
            verification credentials.
          </Policy>

          <Policy title="10. Responsible Communication">
            Support requests should be submitted respectfully and with
            accurate information. False or misleading reports can delay
            assistance.
          </Policy>

          <Policy title="11. Processing Questions">
            Some requests require verification or review and therefore may
            not be resolved immediately. Users should avoid repeatedly
            submitting the same request while it is being reviewed.
          </Policy>

          <Policy title="12. Contact">
            Use the official support contact information made available by
            BLUESTONIE for assistance with your account or platform usage.
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
        <h1 className="mt-3 text-4xl font-extrabold text-white">Support</h1>
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
