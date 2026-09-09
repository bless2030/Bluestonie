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

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="text-xl font-extrabold tracking-tight text-blue-700 sm:text-2xl"
          >
            BLUESTONIE
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            <a
              href="#how-it-works"
              className="text-sm font-medium text-slate-600 hover:text-blue-700"
            >
              How It Works
            </a>

            <a
              href="#packages"
              className="text-sm font-medium text-slate-600 hover:text-blue-700"
            >
              Packages
            </a>

            <a
              href="#tasks"
              className="text-sm font-medium text-slate-600 hover:text-blue-700"
            >
              Daily Activities
            </a>

            <a
              href="#faq"
              className="text-sm font-medium text-slate-600 hover:text-blue-700"
            >
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 sm:block"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-2 lg:py-24">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3 py-1.5 text-xs font-bold text-blue-700 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              Simple. Structured. Digital.
            </div>

            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Manage your financial activities in one place.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              BLUESTONIE provides a simple digital platform where
              subscribers can manage their account, complete daily
              activities, monitor balances and view transaction
              history.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="rounded-xl bg-blue-600 px-6 py-3.5 text-center text-sm font-bold text-white shadow-lg shadow-blue-100 hover:bg-blue-700"
              >
                Create Account
              </Link>

              <Link
                href="/login"
                className="rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-center text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                Sign In
              </Link>
            </div>

            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-500">
              <span>✓ Mobile friendly</span>
              <span>✓ Account dashboard</span>
              <span>✓ Transaction history</span>
            </div>
          </div>

          {/* Hero card */}
          <div className="relative">
            <div className="absolute -inset-6 rounded-full bg-blue-100/60 blur-3xl" />

            <div className="relative rounded-3xl border border-blue-100 bg-white p-4 shadow-2xl shadow-blue-100 sm:p-6">
              <div className="rounded-2xl bg-slate-50 p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400">
                      Account Overview
                    </p>

                    <p className="mt-1 text-2xl font-extrabold">
                      $150.00
                    </p>
                  </div>

                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                    Active
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-white p-4">
                    <p className="text-xs text-slate-400">
                      Package
                    </p>

                    <p className="mt-1 font-bold">
                      Premium
                    </p>
                  </div>

                  <div className="rounded-xl bg-white p-4">
                    <p className="text-xs text-slate-400">
                      Daily activity
                    </p>

                    <p className="mt-1 font-bold">
                      3 / 5
                    </p>
                  </div>
                </div>

                <div className="mt-3 rounded-xl bg-blue-600 p-4 text-white">
                  <p className="text-xs text-blue-100">
                    Account activity
                  </p>

                  <div className="mt-2 flex items-end justify-between">
                    <p className="text-2xl font-extrabold">
                      $4.50
                    </p>

                    <span className="text-xs text-blue-100">
                      Today
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <MiniCard text="Wallet" icon="💰" />
                <MiniCard text="Tasks" icon="✓" />
                <MiniCard text="History" icon="📜" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-slate-100 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-slate-100 px-4 sm:px-6 md:grid-cols-4">
          <Stat value="$10" label="Starting amount" />
          <Stat value="$500" label="Maximum amount" />
          <Stat value="5" label="Daily activities" />
          <Stat value="4" label="Account packages" />
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20"
      >
        <SectionHeading
          eyebrow="How It Works"
          title="A simple account experience"
          description="The platform is designed around a straightforward user journey."
        />

        <div className="mt-10 grid gap-4 md:grid-cols-4">
          <Step
            number="01"
            title="Create Account"
            text="Register and create your subscriber account."
          />

          <Step
            number="02"
            title="Choose Package"
            text="Select an available package and account amount."
          />

          <Step
            number="03"
            title="Complete Activities"
            text="Complete the available daily activities on your dashboard."
          />

          <Step
            number="04"
            title="Monitor Account"
            text="View your wallet, account activity and transaction history."
          />
        </div>
      </section>

      {/* Packages */}
      <section
        id="packages"
        className="bg-slate-50 px-4 py-16 sm:px-6 sm:py-20"
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Packages"
            title="Choose an account package"
            description="Available package ranges are displayed clearly inside the subscriber dashboard."
          />

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {packages.map((pkg, index) => (
              <div
                key={pkg.name}
                className={`rounded-2xl bg-white p-5 shadow-sm ring-1 ${
                  index === 2
                    ? "ring-2 ring-blue-500"
                    : "ring-slate-200"
                }`}
              >
                {index === 2 && (
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-700">
                    Popular
                  </span>
                )}

                <h3 className="mt-3 text-xl font-extrabold">
                  {pkg.name}
                </h3>

                <p className="mt-3 text-2xl font-extrabold text-blue-700">
                  {pkg.range}
                </p>

                <div className="mt-5 rounded-xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-400">
                    Stated package rate
                  </p>

                  <p className="mt-1 font-bold">
                    {pkg.rate}
                  </p>
                </div>

                <Link
                  href="/register"
                  className="mt-5 block rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-center text-sm font-bold text-blue-700 hover:bg-blue-100"
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tasks */}
      <section
        id="tasks"
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20"
      >
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Daily Activities"
              title="Five simple activities"
              description="Subscribers can see their available activities directly on the dashboard. Completed activities are marked as done."
              left
            />

            <Link
              href="/register"
              className="mt-7 inline-block rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white hover:bg-blue-700"
            >
              Create Your Account
            </Link>
          </div>

          <div className="space-y-3">
            <TaskItem number="01" text="Check your account" />
            <TaskItem
              number="02"
              text="Review today's information"
            />
            <TaskItem
              number="03"
              text="Complete daily activity"
            />
            <TaskItem
              number="04"
              text="Review your account"
            />
            <TaskItem
              number="05"
              text="Check transaction history"
            />
          </div>
        </div>
      </section>

      {/* Wallet section */}
      <section className="bg-blue-600 px-4 py-16 text-white sm:px-6 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-100">
              Account Wallet
            </p>

            <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">
              Keep your account activity organized.
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-blue-100 sm:text-base">
              Your dashboard brings together account balances,
              investment information, transactions, deposit requests
              and withdrawal requests.
            </p>
          </div>

          <div className="rounded-3xl bg-white p-5 text-slate-900 shadow-2xl sm:p-7">
            <p className="text-sm text-slate-500">
              Wallet overview
            </p>

            <p className="mt-2 text-4xl font-extrabold">
              $12.00
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-400">
                  Capital
                </p>

                <p className="mt-1 font-bold">
                  $150.00
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-400">
                  Returns
                </p>

                <p className="mt-1 font-bold">
                  $12.00
                </p>
              </div>
            </div>

            <Link
              href="/register"
              className="mt-5 block rounded-xl bg-blue-600 px-5 py-3 text-center text-sm font-bold text-white hover:bg-blue-700"
            >
              Open Account
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        id="faq"
        className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20"
      >
        <SectionHeading
          eyebrow="FAQ"
          title="Frequently asked questions"
          description="A few basic questions about the platform."
        />

        <div className="mt-10 space-y-3">
          <FAQ
            question="What is the minimum account amount?"
            answer="The current prototype displays a minimum amount of $10."
          />

          <FAQ
            question="What is the maximum account amount?"
            answer="The current prototype displays a maximum amount of $500."
          />

          <FAQ
            question="What activities are available?"
            answer="The platform is designed to provide five simple daily activities that appear on the subscriber dashboard."
          />

          <FAQ
            question="What accounting rate is displayed?"
            answer="The prototype uses a fixed accounting display of 1 USD = 4,000 UGX."
          />

          <FAQ
            question="Can I see my transactions?"
            answer="Yes. Subscribers have a transaction history page showing account activity."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-16 sm:px-6 sm:pb-20">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-slate-950 px-5 py-12 text-center text-white sm:px-10">
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            Ready to get started?
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
            Create your account and access your personal
            BLUESTONIE dashboard.
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white hover:bg-blue-500"
            >
              Create Account
            </Link>

            <Link
              href="/login"
              className="rounded-xl border border-slate-700 px-6 py-3.5 text-sm font-bold text-white hover:bg-slate-900"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 px-4 py-10 text-slate-400 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-lg font-extrabold text-white">
                BLUESTONIE
              </p>

              <p className="mt-3 text-sm leading-6">
                A simple digital account management platform.
              </p>
            </div>

            <div>
              <p className="font-bold text-white">
                Platform
              </p>

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
                  href="#tasks"
                  className="block hover:text-white"
                >
                  Daily Activities
                </a>
              </div>
            </div>

            <div>
              <p className="font-bold text-white">
                Account
              </p>

              <div className="mt-3 space-y-2 text-sm">
                <Link
                  href="/login"
                  className="block hover:text-white"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="block hover:text-white"
                >
                  Register
                </Link>
              </div>
            </div>

            <div>
              <p className="font-bold text-white">
                Information
              </p>

              <p className="mt-3 text-sm leading-6">
                Please review all applicable terms,
                disclosures and regulatory information before
                using any financial service.
              </p>
            </div>
          </div>

          <div className="mt-10 border-t border-slate-800 pt-6 text-xs">
            © 2026 BLUESTONIE. Prototype interface.
          </div>
        </div>
      </footer>
    </main>
  );
}

/* Components */

function SectionHeading({
  eyebrow,
  title,
  description,
  left = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  left?: boolean;
}) {
  return (
    <div className={left ? "" : "text-center"}>
      <p className="text-xs font-bold uppercase tracking-wider text-blue-600 sm:text-sm">
        {eyebrow}
      </p>

      <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
        {title}
      </h2>

      <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
        {description}
      </p>
    </div>
  );
}

function Stat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="px-3 py-6 text-center sm:px-6 sm:py-8">
      <p className="text-xl font-extrabold text-slate-900 sm:text-2xl">
        {value}
      </p>

      <p className="mt-1 text-[11px] text-slate-500 sm:text-xs">
        {label}
      </p>
    </div>
  );
}

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
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <span className="text-sm font-extrabold text-blue-600">
        {number}
      </span>

      <h3 className="mt-4 font-extrabold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {text}
      </p>
    </div>
  );
}

function TaskItem({
  number,
  text,
}: {
  number: string;
  text: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-extrabold text-blue-700">
        {number}
      </div>

      <p className="text-sm font-semibold">
        {text}
      </p>

      <span className="ml-auto text-green-500">
        ✓
      </span>
    </div>
  );
}

function MiniCard({
  icon,
  text,
}: {
  icon: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-3 text-center">
      <span className="text-lg">{icon}</span>

      <p className="mt-1 text-[11px] font-bold text-slate-600">
        {text}
      </p>
    </div>
  );
}

function FAQ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <details className="group rounded-2xl border border-slate-200 bg-white p-5">
      <summary className="cursor-pointer list-none pr-6 text-sm font-bold marker:hidden">
        <div className="flex items-center justify-between gap-4">
          <span>{question}</span>

          <span className="text-blue-600 transition group-open:rotate-45">
            +
          </span>
        </div>
      </summary>

      <p className="mt-4 text-sm leading-6 text-slate-500">
        {answer}
      </p>
    </details>
  );
}