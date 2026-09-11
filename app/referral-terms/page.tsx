export default function ReferralTermsPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <Header />
      <section className="mx-auto max-w-5xl px-5 py-10 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
          <p className="leading-7 text-slate-600">
            These Referral Terms govern participation in the BLUESTONIE
            referral programme and should be read together with the main
            Terms & Conditions.
          </p>

          <Policy title="1. Referral Programme">
            The referral programme of 10% per successful Referral. This allows eligible users to introduce other
            people to the BLUESTONIE platform using an assigned referral code
            or referral link.
          </Policy>

          <Policy title="2. Referral Codes">
            Referral codes are associated with user accounts. Users should
            only use their own assigned referral information when inviting
            another person.
          </Policy>

          <Policy title="3. Referral Relationship">
            A referral relationship may be created when a new user registers
            using an eligible referral code and completes the applicable
            qualifying process.
          </Policy>

          <Policy title="4. Qualifying Activity">
            Referral commissions are subject to the qualifying conditions
            defined by the platform. Registration alone does not necessarily
            create an entitlement to a commission.
          </Policy>

          <Policy title="5. Commission Calculation">
            Where applicable, referral commissions are calculated according
            to the commission rate and qualifying transaction rules displayed
            by the platform.
          </Policy>

          <Policy title="6. Commission Status">
            Referral commissions may appear as pending, completed, rejected
            or another applicable status while the underlying transaction
            is being reviewed.
          </Policy>

          <Policy title="7. Self-Referral">
            Users must not create or use additional accounts for the purpose
            of generating artificial referral commissions or bypassing
            platform rules.
          </Policy>

          <Policy title="8. Fraudulent Activity">
            Fake accounts, manipulated transactions, misleading invitations,
            automated abuse or other fraudulent referral activity may result
            in cancellation of commissions and account restrictions.
          </Policy>

          <Policy title="9. Misleading Promotion">
            Users must not make false promises, guarantees or misleading
            statements about BLUESTONIE when promoting their referral link.
          </Policy>

          <Policy title="10. Commission Reversal">
            A commission may be adjusted or reversed where the underlying
            qualifying transaction is cancelled, rejected, reversed or found
            to have violated applicable rules.
          </Policy>

          <Policy title="11. Account Restrictions">
            Referral privileges may be restricted where there is suspected
            abuse, fraud or violation of these Referral Terms.
          </Policy>

          <Policy title="12. Programme Changes">
            BLUESTONIE may modify, suspend or discontinue aspects of the
            referral programme where operational or other legitimate reasons
            require such changes.
          </Policy>

          <Policy title="13. User Responsibility">
            Users are responsible for understanding the referral conditions
            and ensuring that their promotional activities comply with
            applicable laws and platform rules.
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
        <h1 className="mt-3 text-4xl font-extrabold text-white">Referral Terms</h1>
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
