import Link from "next/link";

const packages = [
  {
    name: "Basic",
    range: "$10 – $50",
    rate: "2%",
  },
  {
    name: "Standard",
    range: "$51 – $150",
    rate: "2.5%",
  },
  {
    name: "Premium",
    range: "$151 – $300",
    rate: "3%",
  },
  {
    name: "VVIP",
    range: "$301 – $500",
    rate: "3.5%",
  },
];

const accountFeatures = [
  "Wallet",
  "Deposits",
  "Withdrawals",
  "Transactions",
  "Daily Activities",
  "Referrals",
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F7F8FA] text-[#0F172A] dark:bg-[#0B1120] dark:text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 dark:border-slate-800 dark:bg-[#0B1120]/95">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="text-xl font-extrabold tracking-tight text-[#0F172A] dark:text-white sm:text-2xl"
          >
            BLUESTONIE
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            <a
              href="#how-it-works"
              className="text-sm font-medium text-slate-600 hover:text-[#2563EB] dark:text-slate-300 dark:hover:text-blue-400"
            >
              How It Works
            </a>

            <a
              href="#packages"
              className="text-sm font-medium text-slate-600 hover:text-[#2563EB] dark:text-slate-300 dark:hover:text-blue-400"
            >
              Packages
            </a>

            <a
              href="#account"
              className="text-sm font-medium text-slate-600 hover:text-[#2563EB] dark:text-slate-300 dark:hover:text-blue-400"
            >
              Account
            </a>

            <Link
              href="/support"
              className="text-sm font-medium text-slate-600 hover:text-[#2563EB] dark:text-slate-300 dark:hover:text-blue-400"
            >
              Support
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 sm:block"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#1D4ED8]"
            >
              Create Account
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-slate-200 bg-[#F7F8FA] dark:border-slate-800 dark:bg-[#0B1120]">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:items-center lg:py-24">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.15em] text-[#2563EB]">
              BLUESTONIE
            </p>

            <h1 className="mt-4 max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-[#0F172A] dark:text-white sm:text-5xl lg:text-6xl">
              A simple digital investment account experience.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
              Manage your account, investment packages, daily activities,
              deposits, withdrawals and transactions from one dashboard.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="rounded-lg bg-[#2563EB] px-6 py-3.5 text-center text-sm font-bold text-white hover:bg-[#1D4ED8]"
              >
                Create Account
              </Link>

              <Link
                href="/login"
                className="rounded-lg border border-slate-300 bg-white px-6 py-3.5 text-center text-sm font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-[#111827] dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Account Preview */}
          <div className="lg:pl-8">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#111827] sm:p-7">
              <div className="border-b border-slate-200 pb-5 dark:border-slate-700">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Account Overview
                </p>

                <p className="mt-2 text-3xl font-extrabold text-[#0F172A] dark:text-white">
                  Manage Everything
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Your subscriber dashboard brings your account information
                  together in one place.
                </p>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-200 bg-[#F7F8FA] p-4 dark:border-slate-700 dark:bg-[#0B1120]">
                  <p className="text-xs text-slate-400">Packages</p>

                  <p className="mt-1 text-xl font-extrabold text-[#0F172A] dark:text-white">
                    4
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-[#F7F8FA] p-4 dark:border-slate-700 dark:bg-[#0B1120]">
                  <p className="text-xs text-slate-400">Activities</p>

                  <p className="mt-1 text-xl font-extrabold text-[#0F172A] dark:text-white">
                    5
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-[#F7F8FA] p-4 dark:border-slate-700 dark:bg-[#0B1120]">
                  <p className="text-xs text-slate-400">Transactions</p>

                  <p className="mt-1 text-xl font-extrabold text-[#0F172A] dark:text-white">
                    History
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-[#F7F8FA] p-4 dark:border-slate-700 dark:bg-[#0B1120]">
                  <p className="text-xs text-slate-400">Account</p>

                  <p className="mt-1 text-xl font-extrabold text-[#0F172A] dark:text-white">
                    Dashboard
                  </p>
                </div>
              </div>

              <Link
                href="/register"
                className="mt-5 block rounded-lg bg-[#0F172A] px-5 py-3 text-center text-sm font-bold text-white hover:bg-[#1E293B] dark:bg-white dark:text-[#0F172A] dark:hover:bg-slate-200"
              >
                Open Your Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Information */}
      <section className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-[#111827]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4">
          <Stat value="$10" label="Starting amount" />
          <Stat value="$500" label="Maximum amount" />
          <Stat value="5" label="Daily activities" />
          <Stat value="4" label="Packages" />
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20"
      >
        <SectionHeading
          eyebrow="How It Works"
          title="Getting started is straightforward."
          description="BLUESTONIE is organized around a simple account journey."
        />

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <Step
            number="01"
            title="Create Account"
            text="Register your account and complete the required verification."
          />

          <Step
            number="02"
            title="Choose a Package"
            text="Review the available packages and select an option available to you."
          />

          <Step
            number="03"
            title="Manage Your Account"
            text="Use your dashboard to monitor activities, balances and transactions."
          />
        </div>
      </section>

      {/* Packages */}
      <section
        id="packages"
        className="border-y border-slate-200 bg-white px-4 py-16 dark:border-slate-800 dark:bg-[#111827] sm:px-6 sm:py-20"
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Packages"
            title="Available investment packages."
            description="The following package ranges and displayed rates are currently configured on the platform."
          />

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {packages.map((pkg, index) => (
              <div
                key={pkg.name}
                className={`rounded-2xl border bg-[#F7F8FA] p-5 dark:bg-[#0B1120] ${
                  index === 2
                    ? "border-[#2563EB] dark:border-blue-500"
                    : "border-slate-200 dark:border-slate-700"
                }`}
              >
                {index === 2 && (
                  <p className="text-xs font-bold uppercase tracking-wider text-[#2563EB] dark:text-blue-400">
                    Popular
                  </p>
                )}

                <p className="mt-2 text-sm font-bold text-[#2563EB] dark:text-blue-400">
                  {pkg.name}
                </p>

                <p className="mt-4 text-2xl font-extrabold text-[#0F172A] dark:text-white">
                  {pkg.range}
                </p>

                <div className="mt-5 border-t border-slate-200 pt-4 dark:border-slate-700">
                  <p className="text-xs text-slate-400">
                    Displayed package rate
                  </p>

                  <p className="mt-1 text-lg font-extrabold text-[#0F172A] dark:text-white">
                    {pkg.rate}
                  </p>
                </div>

                <Link
                  href="/register"
                  className="mt-5 block rounded-lg border border-[#BFDBFE] bg-[#EFF6FF] px-4 py-3 text-center text-sm font-bold text-[#2563EB] hover:bg-[#DBEAFE] dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-400 dark:hover:bg-blue-950"
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>

          <p className="mx-auto mt-7 max-w-3xl text-center text-xs leading-5 text-slate-500 dark:text-slate-400">
            Package rates shown on this page are for informational purposes.
            Please review the applicable terms, risk disclosure and other
            platform information before making any financial decision.
          </p>

          <div className="mt-6 text-center">
            <Link
              href="/risk-disclosure"
              className="text-sm font-semibold text-[#2563EB] hover:text-[#1D4ED8] dark:text-blue-400 dark:hover:text-blue-300"
            >
              Read the Risk Disclosure
            </Link>
          </div>
        </div>
      </section>

      {/* Account Features */}
      <section
        id="account"
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20"
      >
        <SectionHeading
          eyebrow="Your Dashboard"
          title="Everything organized in one account."
          description="Once signed in, subscribers can access the main areas of their BLUESTONIE account."
        />

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {accountFeatures.map((feature, index) => (
            <div
              key={feature}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4 dark:border-slate-700 dark:bg-[#111827]"
            >
              <div>
                <p className="text-xs font-bold text-[#2563EB] dark:text-blue-400">
                  {String(index + 1).padStart(2, "0")}
                </p>

                <p className="mt-1 font-bold text-[#0F172A] dark:text-white">
                  {feature}
                </p>
              </div>

              <Link
                href="/login"
                className="text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] dark:text-blue-400 dark:hover:text-blue-300"
              >
                Sign in
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Important Information */}
      <section className="border-y border-slate-200 bg-[#F7F8FA] px-4 py-16 dark:border-slate-800 dark:bg-[#0B1120] sm:px-6 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.15em] text-[#2563EB] dark:text-blue-400">
              Important Information
            </p>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0F172A] dark:text-white sm:text-4xl">
              Understand the platform before you participate.
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
              Please take time to understand the terms governing your account,
              deposits, withdrawals, referrals and the risks associated with
              financial activities.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <InfoLink href="/terms" text="Terms & Conditions" />
            <InfoLink href="/privacy" text="Privacy Policy" />
            <InfoLink
              href="/deposit-withdrawal-policy"
              text="Deposit & Withdrawal Policy"
            />
            <InfoLink href="/referral-terms" text="Referral Terms" />
            <InfoLink href="/risk-disclosure" text="Risk Disclosure" />
            <InfoLink href="/support" text="Support" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-5xl rounded-3xl bg-[#0F172A] px-5 py-12 text-center text-white sm:px-10">
          <p className="text-sm font-bold uppercase tracking-[0.15em] text-blue-400">
            BLUESTONIE
          </p>

          <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
            Ready to get started?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
            Create your account and access your personal BLUESTONIE dashboard.
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="rounded-lg bg-[#2563EB] px-6 py-3.5 text-sm font-bold text-white hover:bg-[#1D4ED8]"
            >
              Create Account
            </Link>

            <Link
              href="/login"
              className="rounded-lg border border-slate-600 px-6 py-3.5 text-sm font-bold text-white hover:bg-slate-800"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#0F172A] px-4 py-10 text-slate-400 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-lg font-extrabold text-white">
                BLUESTONIE
              </p>

              <p className="mt-3 max-w-xs text-sm leading-6">
                A digital platform for managing your account, investments and
                related activities.
              </p>
            </div>

            <div>
              <p className="font-bold text-white">Platform</p>

              <div className="mt-3 space-y-2 text-sm">
                <a
                  href="#how-it-works"
                  className="block hover:text-white"
                >
                  How It Works
                </a>

                <a
                  href="#packages"
                  className="block hover:text-white"
                >
                  Packages
                </a>

                <a
                  href="#account"
                  className="block hover:text-white"
                >
                  Dashboard
                </a>
              </div>
            </div>

            <div>
              <p className="font-bold text-white">Account</p>

              <div className="mt-3 space-y-2 text-sm">
                <Link href="/login" className="block hover:text-white">
                  Login
                </Link>

                <Link href="/register" className="block hover:text-white">
                  Create Account
                </Link>

                <Link href="/support" className="block hover:text-white">
                  Support
                </Link>
              </div>
            </div>

            <div>
              <p className="font-bold text-white">Legal</p>

              <div className="mt-3 space-y-2 text-sm">
                <Link href="/terms" className="block hover:text-white">
                  Terms
                </Link>

                <Link href="/privacy" className="block hover:text-white">
                  Privacy
                </Link>

                <Link
                  href="/risk-disclosure"
                  className="block hover:text-white"
                >
                  Risk Disclosure
                </Link>

                <Link
                  href="/deposit-withdrawal-policy"
                  className="block hover:text-white"
                >
                  Deposit & Withdrawal Policy
                </Link>

                <Link
                  href="/referral-terms"
                  className="block hover:text-white"
                >
                  Referral Terms
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-slate-800 pt-6 text-xs leading-5">
            © 2026 BLUESTONIE. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}

/* Section Heading */

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#2563EB] dark:text-blue-400 sm:text-sm">
        {eyebrow}
      </p>

      <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0F172A] dark:text-white sm:text-4xl">
        {title}
      </h2>

      <p className="mx-auto mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
        {description}
      </p>
    </div>
  );
}

/* Stat */

function Stat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="border-r border-slate-200 px-3 py-6 text-center last:border-r-0 dark:border-slate-800 sm:px-6 sm:py-8">
      <p className="text-xl font-extrabold text-[#0F172A] dark:text-white sm:text-2xl">
        {value}
      </p>

      <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 sm:text-xs">
        {label}
      </p>
    </div>
  );
}

/* Step */

function Step({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-[#111827]">
      <p className="text-sm font-extrabold text-[#2563EB] dark:text-blue-400">
        {number}
      </p>

      <h3 className="mt-5 text-lg font-extrabold text-[#0F172A] dark:text-white">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
        {text}
      </p>
    </div>
  );
}

/* Information Link */

function InfoLink({
  href,
  text,
}: {
  href: string;
  text: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm font-bold text-[#0F172A] hover:border-[#93C5FD] hover:text-[#2563EB] dark:border-slate-700 dark:bg-[#111827] dark:text-slate-200 dark:hover:border-blue-700 dark:hover:text-blue-400"
    >
      {text}
    </Link>
  );
}