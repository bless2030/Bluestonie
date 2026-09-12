export default function SupportPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 dark:bg-[#0B1120] dark:text-slate-100">
      <Header />

      <section className="mx-auto max-w-6xl px-5 py-10 sm:px-6">
        {/* Welcome */}
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            We are here to help
          </p>

          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            How can we help you?
          </h2>

          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
            Welcome to BLUESTONIE Support. Whether you have a question about
            your account, deposits, withdrawals, investments, referrals or a
            technical issue, we are happy to help.
          </p>
        </div>

        {/* Contact methods */}
        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-[#111827]">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Official Email
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
              Contact us for account assistance, transaction questions and
              general enquiries.
            </p>

            <a
              href="mailto:info@bluestonie.online"
              className="mt-4 inline-block break-all font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              info@bluestonie.online
            </a>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-[#111827]">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Gmail Support
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
              You can also reach our support team through our Gmail contact.
            </p>

            <a
              href="mailto:bluestonieinvestments@gmail.com"
              className="mt-4 inline-block break-all font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              bluestonieinvestments@gmail.com
            </a>
          </div>

          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 shadow-sm dark:border-blue-900 dark:bg-blue-950/40">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Live Chat
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              We are preparing a live chat service to make communication with
              our support team even easier.
            </p>

            <p className="mt-4 font-bold text-blue-600 dark:text-blue-400">
              Live Chat — Coming Soon
            </p>
          </div>
        </div>

        {/* Support form */}
        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-[#111827] sm:p-8">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Contact Support
            </p>

            <h2 className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
              Tell us about your problem
            </h2>

            <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
              Complete the form below and provide as much useful information
              as possible. This will help us understand your request and
              respond more effectively.
            </p>
          </div>

          <form
            action="mailto:info@bluestonie.online"
            method="POST"
            encType="text/plain"
            className="mt-8 space-y-6"
          >
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-200"
                >
                  Your name
                </label>

                <input
                  id="name"
                  name="Name"
                  type="text"
                  placeholder="Enter your name"
                  required
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-[#0B1120] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-400 dark:focus:ring-blue-950"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-200"
                >
                  Email address
                </label>

                <input
                  id="email"
                  name="Email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-[#0B1120] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-400 dark:focus:ring-blue-950"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="category"
                className="text-sm font-semibold text-slate-700 dark:text-slate-200"
              >
                What do you need help with?
              </label>

              <select
                id="category"
                name="Category"
                required
                defaultValue=""
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-[#0B1120] dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-950"
              >
                <option value="" disabled>
                  Select a topic
                </option>
                <option value="Account">Account</option>
                <option value="Registration">Registration</option>
                <option value="Email Verification">Email Verification</option>
                <option value="Deposit">Deposit</option>
                <option value="Withdrawal">Withdrawal</option>
                <option value="Investment Package">
                  Investment Package
                </option>
                <option value="Daily Activities">Daily Activities</option>
                <option value="Referral">Referral</option>
                <option value="Technical Problem">Technical Problem</option>
                <option value="Security Concern">Security Concern</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="reference"
                className="text-sm font-semibold text-slate-700 dark:text-slate-200"
              >
                Transaction or account reference
                <span className="ml-1 font-normal text-slate-400">
                  (optional)
                </span>
              </label>

              <input
                id="reference"
                name="Reference"
                type="text"
                placeholder="Enter a reference if applicable"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-[#0B1120] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-400 dark:focus:ring-blue-950"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="text-sm font-semibold text-slate-700 dark:text-slate-200"
              >
                Tell us what happened
              </label>

              <textarea
                id="message"
                name="Message"
                rows={6}
                placeholder="Please describe your problem or question..."
                required
                className="mt-2 w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-[#0B1120] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-400 dark:focus:ring-blue-950"
              />
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-[#0B1120]">
              <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
                Please do not include your password, verification code,
                banking password or other confidential login credentials in
                your message.
              </p>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-[#111827] sm:w-auto"
            >
              Send Support Request
            </button>
          </form>
        </section>

        {/* Expandable help sections */}
        <section className="mt-10">
          <div className="mb-5">
            <p className="text-sm font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Quick Help
            </p>

            <h2 className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
              Common questions
            </h2>

            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Select a topic below to learn more.
            </p>
          </div>

          <div className="space-y-3">
            <HelpSection title="Account and Registration">
              <p>
                If you are having trouble creating an account, logging in or
                accessing your account, first make sure that you are using the
                correct email address and password.
              </p>

              <p>
                If your account requires email verification, check your Inbox,
                Spam, Junk or Promotions folder for the verification message.
              </p>
            </HelpSection>

            <HelpSection title="Deposits">
              <p>
                If you have submitted a deposit and it remains pending, keep
                your transaction reference and payment information available
                when contacting support.
              </p>

              <p>
                Support may request additional information before a
                transaction can be reviewed.
              </p>
            </HelpSection>

            <HelpSection title="Withdrawals">
              <p>
                If you have questions about a withdrawal request, provide the
                relevant withdrawal details or reference when contacting
                support.
              </p>

              <p>
                Some requests may require review before they can be completed.
              </p>
            </HelpSection>

            <HelpSection title="Investment Packages">
              <p>
                Review the package information displayed on the platform
                before making an investment decision. If something appears
                unclear, contact support for assistance understanding the
                information displayed.
              </p>
            </HelpSection>

            <HelpSection title="Daily Activities and Returns">
              <p>
                If a daily activity does not appear correctly or you have
                difficulty completing an activity, tell us which activity you
                were attempting to complete and what happened.
              </p>
            </HelpSection>

            <HelpSection title="Referral Programme">
              <p>
                For referral questions, provide the relevant referral code or
                account information where appropriate. Never provide your
                password or verification code.
              </p>
            </HelpSection>

            <HelpSection title="Technical Problems">
              <p>
                When reporting a technical problem, tell us which page you
                were using, what you expected to happen and what happened
                instead.
              </p>

              <p>
                Screenshots can be helpful when reporting display or technical
                problems.
              </p>
            </HelpSection>

            <HelpSection title="Security Concerns">
              <p>
                If you believe someone has accessed your account without
                permission, change your password as soon as possible and
                contact support.
              </p>

              <p>
                BLUESTONIE support will never require you to send your
                password or verification code.
              </p>
            </HelpSection>

            <HelpSection title="What information should I include?">
              <p>
                A useful support request may include your registered email,
                transaction reference, approximate time of the problem and a
                clear description of what happened.
              </p>

              <p>
                Providing clear information helps our team understand your
                request more quickly.
              </p>
            </HelpSection>

            <HelpSection title="Live Chat">
              <p>
                We are currently preparing a live chat service for BLUESTONIE.
                This will provide another convenient way for users to
                communicate directly with the support team.
              </p>

              <p className="font-semibold text-blue-600 dark:text-blue-400">
                Live Chat is coming soon.
              </p>
            </HelpSection>
          </div>
        </section>

        {/* Friendly closing */}
        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-700 dark:bg-[#111827] sm:p-8">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            We are happy to hear from you
          </h2>

          <p className="mx-auto mt-3 max-w-2xl leading-7 text-slate-600 dark:text-slate-300">
            If you cannot find the answer you are looking for, please contact
            us. We will do our best to understand your concern and guide you
            through the next steps.
          </p>

          <a
            href="mailto:info@bluestonie.online"
            className="mt-5 inline-block rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-700"
          >
            Email BLUESTONIE Support
          </a>
        </section>
      </section>

      <Footer />
    </main>
  );
}

function HelpSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <details className="group rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-[#111827]">
      <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 font-bold text-slate-900 dark:text-white">
        <span>{title}</span>

        <span className="ml-4 text-xl font-normal text-slate-400 transition-transform group-open:rotate-45">
          +
        </span>
      </summary>

      <div className="border-t border-slate-200 px-5 py-5 text-sm leading-7 text-slate-600 dark:border-slate-700 dark:text-slate-300">
        <div className="space-y-3">{children}</div>
      </div>
    </details>
  );
}

function Header() {
  return (
    <header className="border-b border-slate-800 bg-slate-900">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-6">
        <a
          className="text-xl font-extrabold tracking-tight text-white"
        >
          BLUESTONIE
        </a>

        <a
  href="/dashboard"
  className="text-sm font-semibold text-slate-300 hover:text-white"
>
  Back to Dashboard
</a>
      </div>

      <div className="mx-auto max-w-6xl px-5 pb-10 pt-8 sm:px-6">
        <p className="text-sm font-bold uppercase tracking-wider text-blue-400">
          BLUESTONIE Investments
        </p>

        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-white">
          Support Centre
        </h1>

        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">
          Get answers, report a problem or contact our support team for
          assistance with the BLUESTONIE platform.
        </p>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-900">
      <div className="mx-auto max-w-7xl px-5 py-8 text-center sm:px-6">
        <p className="font-semibold text-white">BLUESTONIE Investments</p>

        <div className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
          <a
            href="mailto:info@bluestonie.online"
            className="font-semibold text-blue-300 hover:text-blue-200"
          >
            info@bluestonie.online
          </a>

          <a
            href="mailto:bluestonieinvestments@gmail.com"
            className="font-semibold text-blue-300 hover:text-blue-200"
          >
            bluestonieinvestments@gmail.com
          </a>
        </div>

        <a
          href="/"
          className="mt-4 inline-block text-sm font-semibold text-slate-300 hover:text-white"
        >
          Return to BLUESTONIE
        </a>
      </div>
    </footer>
  );
}