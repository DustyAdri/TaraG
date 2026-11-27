import type { TripRequest } from "./types";

export interface ExpenseRow {
  id: number;
  category: string;
  amount: string;
}

export interface TripForm {
  destination: string;
  weeksLeft: string;
  groupSize: string;
  currentSavings: string;
  expenses: ExpenseRow[];
}

/** Keys: destination | weeksLeft | groupSize | currentSavings | expense-<id>-category | expense-<id>-amount */
export type FormErrors = Record<string, string>;

const toNumber = (s: string) => (s.trim() === "" ? NaN : Number(s));

/**
 * Checks the form before anything is sent (TC-04).
 * Returns the cleaned request, or the errors to show next to each field.
 */
export function validateTrip(form: TripForm): { errors: FormErrors; request?: TripRequest } {
  const errors: FormErrors = {};

  const destination = form.destination.trim();
  if (!destination) errors.destination = "Please tell us where you're going.";
  else if (destination.length > 120) errors.destination = "Please keep this under 120 characters.";

  const weeks = toNumber(form.weeksLeft);
  if (Number.isNaN(weeks)) errors.weeksLeft = "Please enter how many weeks are left.";
  else if (weeks <= 0) errors.weeksLeft = "Weeks until the trip must be at least 1.";
  else if (!Number.isInteger(weeks)) errors.weeksLeft = "Please use a whole number of weeks.";

  const people = toNumber(form.groupSize);
  if (Number.isNaN(people)) errors.groupSize = "Please enter how many people are going.";
  else if (people <= 0) errors.groupSize = "At least 1 person needs to be going.";
  else if (!Number.isInteger(people)) errors.groupSize = "Please use a whole number of people.";

  // Blank savings means the group hasn't saved anything yet.
  const savings = form.currentSavings.trim() === "" ? 0 : Number(form.currentSavings);
  if (Number.isNaN(savings)) errors.currentSavings = "Please enter a number.";
  else if (savings < 0) errors.currentSavings = "Savings can't be negative.";

  const expectedExpenses: TripRequest["expectedExpenses"] = [];
  for (const row of form.expenses) {
    const category = row.category.trim();
    const hasAmount = row.amount.trim() !== "";
    if (!category && !hasAmount) continue; // empty row, skip it

    const amount = toNumber(row.amount);
    if (!category) errors[`expense-${row.id}-category`] = "What is this expense for?";
    if (!hasAmount) errors[`expense-${row.id}-amount`] = "Add an amount, or remove this row.";
    else if (Number.isNaN(amount)) errors[`expense-${row.id}-amount`] = "Please enter a number.";
    else if (amount < 0) errors[`expense-${row.id}-amount`] = "Amounts can't be negative.";

    if (category && hasAmount && amount >= 0) expectedExpenses.push({ category, amount });
  }

  if (Object.keys(errors).length > 0) return { errors };
  return {
    errors,
    request: { destination, weeksLeft: weeks, groupSize: people, currentSavings: savings, expectedExpenses },
  };
}
