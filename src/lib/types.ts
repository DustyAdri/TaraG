export type HealthStatus = "On Track" | "Needs Adjustment" | "High Risk" | "Out of Scope";

export interface ExpenseItem {
  category: string;
  estimated_amount: number;
  saving_tip: string;
}

/** The plan the server sends in the final `done` event. */
export interface TripPlan {
  trip_summary: string;
  estimated_total_cost: number;
  recommended_misc_buffer: number;
  expense_breakdown: ExpenseItem[];
  weekly_savings_target_per_person: number;
  financial_health_status: HealthStatus;
}

/** What the planner form sends to POST /api/plan. */
export interface TripRequest {
  destination: string;
  weeksLeft: number;
  groupSize: number;
  currentSavings: number;
  expectedExpenses: { category: string; amount: number }[];
}
