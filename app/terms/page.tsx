"use client";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-6">
          <a className="text-xl font-extrabold tracking-tight text-white">
            BLUESTONIE
          </a>
          <a
  href="/dashboard"
  className="text-sm font-semibold text-slate-300 hover:text-white"
>
  Back to Dashboard
</a>
        </div>
      </header>

      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-5 py-12 sm:px-6">
          <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
            BLUESTONIE Investments
          </p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900">
            Terms & Conditions
          </h1>
          <p className="mt-4 max-w-3xl leading-7 text-slate-600">
            These Terms & Conditions establish the general rules governing
            access to and use of the BLUESTONIE Investments platform.
            By creating an account or using the platform, you acknowledge
            that you have read and understood these terms.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-10 sm:px-6">
        <div className="space-y-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">

          <PolicySection title="1. Acceptance of These Terms">
            By registering for an account or accessing BLUESTONIE Investments,
            you agree to comply with these Terms & Conditions and other
            policies applicable to your use of the platform. If you do not
            agree with these terms, you should not use the platform.
          </PolicySection>

          <PolicySection title="2. Account Registration">
            Users must provide accurate information when creating an account.
            Information may include a name, telephone number, email address
            and other information required by the registration process.
            Users are responsible for keeping their account information
            current and accurate.
          </PolicySection>

          <PolicySection title="3. Eligibility">
            Users are responsible for ensuring that their use of the platform
            is permitted under the laws and regulations applicable to them.
            BLUESTONIE may restrict access where necessary to protect the
            platform, its users or comply with applicable requirements.
          </PolicySection>

          <PolicySection title="4. Account Security">
            Each user is responsible for maintaining the confidentiality of
            their login credentials. Users should not share passwords,
            verification codes or other account security information with
            another person.
          </PolicySection>

          <PolicySection title="5. Accurate Information">
            Providing false, misleading, incomplete or fraudulent information
            may result in account restrictions, suspension or other appropriate
            action. Users should promptly correct information that becomes
            inaccurate.
          </PolicySection>

          <PolicySection title="6. Platform Use">
            The platform should only be used for lawful purposes and in
            accordance with these terms. Users must not attempt to interfere
            with platform security, manipulate records, gain unauthorized
            access or misuse another user's account.
          </PolicySection>

          <PolicySection title="7. Deposits">
            Deposits must be made using the payment instructions displayed by
            the platform. Users should carefully verify payment details before
            sending funds and should retain their transaction reference for
            verification.
          </PolicySection>

          <PolicySection title="8. Investment Packages">
            Available packages, minimum amounts, maximum amounts, returns,
            conditions and other package information are displayed through
            the platform. Users should review the applicable information before
            making a deposit or selecting a package.
          </PolicySection>

          <PolicySection title="9. Returns and Balances">
            Account balances and returns displayed by the platform are subject
            to the applicable platform rules and transaction records. A
            displayed balance should not be interpreted as an unconditional
            guarantee of future performance.
          </PolicySection>

          <PolicySection title="10. Withdrawals">
            Withdrawal requests are subject to the withdrawal rules displayed
            by the platform, including applicable minimum amounts, fees,
            verification and processing requirements.
          </PolicySection>

          <PolicySection title="11. Referral Programme">
            Where the referral programme is available, users must comply with
            the Referral Terms. Referral commissions are subject to the
            qualifying conditions and calculations applicable to the programme.
          </PolicySection>

          <PolicySection title="12. Daily Activities">
            Where daily activities are provided, users must complete activities
            according to the instructions displayed on the platform. Activity
            completion does not by itself create a right to payment outside
            the applicable platform rules.
          </PolicySection>

          <PolicySection title="13. Prohibited Activities">
            Users must not engage in fraud, impersonation, account abuse,
            unauthorized access, manipulation of transactions, misleading
            referral practices or any activity intended to circumvent
            platform controls.
          </PolicySection>

          <PolicySection title="14. Account Suspension or Deactivation">
            BLUESTONIE may restrict, suspend or deactivate an account where
            there are reasonable grounds relating to security, fraud,
            misuse, policy violations or other legitimate platform concerns.
          </PolicySection>

          <PolicySection title="15. Platform Changes">
            Features, services, packages, policies and platform functionality
            may change over time. Where appropriate, important changes may be
            communicated through the platform.
          </PolicySection>

          <PolicySection title="16. Risk Acknowledgement">
            Users acknowledge that financial and investment-related activities
            involve risks. Users should review the Risk Disclosure before
            committing funds.
          </PolicySection>

          <PolicySection title="17. Limitation of Responsibility">
            Users are responsible for their own decisions and for reviewing
            information before submitting transactions. Nothing on the
            platform should be treated as a substitute for independent
            financial, legal or professional advice.
          </PolicySection>

          <PolicySection title="18. Questions and Support">
            Users who require assistance should contact BLUESTONIE through
            the available support channels and provide sufficient information
            for the support team to understand the issue.
          </PolicySection>

          <PolicySection title="19. Changes to These Terms">
            These Terms & Conditions may be updated from time to time.
            Continued use of the platform after an applicable update may
            constitute acceptance of the revised terms.
          </PolicySection>

          <PolicySection title="20. Acceptance">
            By registering for and using BLUESTONIE Investments, you confirm
            that you have read these Terms & Conditions and understand the
            responsibilities associated with using the platform.
          </PolicySection>

        </div>
      </section>

      <Footer />
    </main>
  );
}

function PolicySection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      <p className="mt-3 leading-7 text-slate-600">{children}</p>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-900">
      <div className="mx-auto max-w-7xl px-5 py-8 text-center">
        <p className="text-sm font-semibold text-white">BLUESTONIE Investments</p>
        <p className="mt-2 text-sm text-slate-400">
          Please review all applicable platform policies before using the service.
        </p>
        <a href="/" className="mt-3 inline-block text-sm font-semibold text-blue-300 hover:text-white">
          Return to BLUESTONIE
        </a>
      </div>
    </footer>
  );
}
