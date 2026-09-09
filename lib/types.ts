// UI data contracts derived from the columns currently consumed by the app.
// Replace these with generated Supabase database types when the schema is available.

export type MoneyValue = number | string | null | undefined;

export type Profile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  country: string | null;
  role: string | null;
  status: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type Wallet = {
  user_id: string;
  balance_usd: MoneyValue;
  balance_ugx: MoneyValue;
  accumulated_returns_usd: MoneyValue;
  total_invested_usd: MoneyValue;
  total_returns_usd: MoneyValue;
};

export type Package = {
  id: string;
  name: string;
  min_usd: MoneyValue;
  max_usd: MoneyValue;
  displayed_roi_percent: MoneyValue;
  is_active?: boolean | null;
};

export type Deposit = {
  id: string;
  user_id: string;
  amount_usd: MoneyValue;
  amount_ugx: MoneyValue;
  reference: string | null;
  status: string;
  proof_url?: string | null;
  reviewed_at?: string | null;
  reviewed_by?: string | null;
  admin_note?: string | null;
  submitted_at: string;

profiles?: {
    id: string;
    full_name: string | null;
    phone: string | null;
    country: string | null;
    role: string | null;
    status: string | null;
    created_at: string | null;
  } | null;
};


export type Task = {
  id: string;
  title: string;
  description: string | null;
  is_active?: boolean | null;
  display_order?: number | null;
};

export type TaskCompletion = {
  task_id: string;
  completed_on: string;
  completed_at: string | null;
};

export type Notice = {
  id: string;
  title: string | null;
  message: string;
  recipient_id: string | null;
  created_at: string | null;
  is_active?: boolean | null;
};

export type Transaction = {
  id: string;
  type: string | null;
  status: string | null;
  amount_usd: MoneyValue;
  amount_ugx: MoneyValue;
  description: string | null;
  reference: string | null;
  created_at: string | null;
};

export type Investment = {
  id: string;
  amount_usd: MoneyValue;
  lock_until: string | null;
  status?: string | null;
  created_at?: string | null;
};

export type Withdrawal = {
  id: string;
  user_id: string;
  requested_amount_usd: MoneyValue;
  fee_percent: MoneyValue;
  fee_usd: MoneyValue;
  net_amount_usd: MoneyValue;
  status: string | null;
  requested_at?: string | null;
  created_at?: string | null;
  reviewed_at?: string | null;
  admin_note?: string | null;
  capital_amount?: MoneyValue;
  lock_until?: string | null;
  // These may be present on older rows; member history uses them as a fallback.
  amount_usd?: MoneyValue;
  amount_ugx?: MoneyValue;
  reference?: string | null;

  profiles?: {
    id: string;
    full_name: string | null;
    phone: string | null;
    country: string | null;
    role: string | null;
    status: string | null;
    created_at: string | null;
  } | null;
};