export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <Header title="Privacy Policy" />
      <section className="mx-auto max-w-5xl px-5 py-10 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
          <Intro>
            This Privacy Policy explains how information may be collected,
            used, protected and handled when you use BLUESTONIE Investments.
            We aim to handle user information responsibly and only use it
            for legitimate platform and service purposes.
          </Intro>

          <Policy title="1. Information We Collect">
            Information may include registration details, contact information,
            account information, transaction records, referral information,
            platform activity and technical information required to operate
            and secure the service.
          </Policy>

          <Policy title="2. Registration Information">
            When you create an account, information supplied during registration
            may be associated with your account so that the platform can
            provide account access, verification and relevant services.
          </Policy>

          <Policy title="3. Transaction Information">
            Deposit, withdrawal and related transaction information may be
            recorded to process requests, maintain accurate records, prevent
            misuse and provide account support.
          </Policy>

          <Policy title="4. How Information Is Used">
            Information may be used to operate the platform, authenticate
            users, process transactions, communicate important information,
            provide support, improve platform functionality and protect
            against fraud or unauthorized activity.
          </Policy>

          <Policy title="5. Account Security">
            Reasonable technical and organizational measures are used to help
            protect account information. Users must also protect their
            passwords and other credentials.
          </Policy>

          <Policy title="6. Information Sharing">
            Personal information should not be shared unnecessarily. Information
            may be disclosed where necessary to operate services, comply with
            applicable obligations, protect users or the platform, or respond
            to legitimate requests.
          </Policy>

          <Policy title="7. Service Providers">
            Certain platform functions may depend on technology and service
            providers. Where third-party services are used, information may
            be processed as necessary to provide the relevant functionality.
          </Policy>

          <Policy title="8. Data Retention">
            Information may be retained for as long as reasonably necessary
            for account administration, transaction records, security,
            dispute resolution and other legitimate operational purposes.
          </Policy>

          <Policy title="9. User Responsibilities">
            Users should provide accurate information and notify support when
            they identify an important error or unauthorized activity involving
            their account.
          </Policy>

          <Policy title="10. Communications">
            BLUESTONIE may send account-related communications such as
            verification messages, transaction updates, security notices
            and important platform information.
          </Policy>

          <Policy title="11. Cookies and Technical Data">
            The platform may use cookies, local storage or similar technical
            mechanisms where necessary to maintain sessions, remember settings,
            improve functionality or support security.
          </Policy>

          <Policy title="12. Children's Privacy">
            The platform is not intended to be used in violation of applicable
            age or legal requirements. Users are responsible for ensuring
            that their use of the service is lawful.
          </Policy>

          <Policy title="13. Changes to This Policy">
            This Privacy Policy may be updated when platform practices,
            technologies or applicable requirements change.
          </Policy>

          <Policy title="14. Contact">
            Questions about privacy or account information should be directed
            to the available BLUESTONIE support channels.
          </Policy>
        </div>
      </section>
      <Footer />
    </main>
  );
}

function Header({ title }: { title: string }) {
  return (
    <header className="border-b border-slate-800 bg-slate-900">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-6">
        <a href="/" className="text-xl font-extrabold text-white">BLUESTONIE</a>
        <a href="/" className="text-sm font-semibold text-slate-300 hover:text-white">Back to Home</a>
      </div>
      <div className="mx-auto max-w-5xl px-5 pb-10 pt-8 sm:px-6">
        <p className="text-sm font-bold uppercase tracking-wider text-blue-400">BLUESTONIE Investments</p>
        <h1 className="mt-3 text-4xl font-extrabold text-white">{title}</h1>
      </div>
    </header>
  );
}

function Intro({ children }: { children: React.ReactNode }) {
  return <p className="mb-8 text-base leading-7 text-slate-600">{children}</p>;
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
