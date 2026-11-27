import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { validateTrip, type ExpenseRow, type FormErrors, type TripForm as TripFormValues } from "../../lib/validation";
import type { TripRequest } from "../../lib/types";
import { CloseIcon, PlusIcon, SparkleIcon } from "../Icons";

interface TripFormProps {
  busy: boolean;
  onSubmit: (request: TripRequest) => void;
}

let nextRowId = 1;
const newRow = (): ExpenseRow => ({ id: nextRowId++, category: "", amount: "" });

/** 5.1a trip input form with front-end validation (TC-04). */
export function TripForm({ busy, onSubmit }: TripFormProps) {
  const [form, setForm] = useState<TripFormValues>(() => ({
    destination: "",
    weeksLeft: "",
    groupSize: "",
    currentSavings: "",
    expenses: [newRow()],
  }));
  const [errors, setErrors] = useState<FormErrors>({});
  const formRef = useRef<HTMLFormElement>(null);

  const clearError = (key: string) =>
    setErrors((e) => {
      if (!(key in e)) return e;
      const { [key]: _removed, ...rest } = e;
      return rest;
    });

  const setField = (key: "destination" | "weeksLeft" | "groupSize" | "currentSavings", value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    clearError(key);
  };

  const setExpense = (id: number, key: "category" | "amount", value: string) => {
    setForm((f) => ({ ...f, expenses: f.expenses.map((r) => (r.id === id ? { ...r, [key]: value } : r)) }));
    clearError(`expense-${id}-${key}`);
  };

  const addExpense = () => setForm((f) => ({ ...f, expenses: [...f.expenses, newRow()] }));
  const removeExpense = (id: number) => {
    setForm((f) => ({ ...f, expenses: f.expenses.filter((r) => r.id !== id) }));
    clearError(`expense-${id}-category`);
    clearError(`expense-${id}-amount`);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    const { errors: found, request } = validateTrip(form);
    setErrors(found);
    if (!request) {
      // Move focus to the first field with a problem.
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>("[aria-invalid='true']")?.focus());
      return;
    }
    onSubmit(request);
  };

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <form ref={formRef} className="card trip-form" onSubmit={submit} noValidate aria-busy={busy}>
      <h2 className="card-title">Tell us about your trip</h2>

      <Field id="destination" label="Where are you going?" error={errors.destination}>
        <input
          id="destination"
          type="text"
          placeholder="e.g. Siargao"
          maxLength={120}
          value={form.destination}
          onChange={(e) => setField("destination", e.target.value)}
          aria-invalid={!!errors.destination}
          aria-describedby={errors.destination ? "destination-error" : undefined}
          disabled={busy}
        />
      </Field>

      <div className="field-row">
        <Field id="weeksLeft" label="Weeks until the trip" error={errors.weeksLeft}>
          <input
            id="weeksLeft"
            type="number"
            inputMode="numeric"
            min={1}
            step={1}
            placeholder="e.g. 8"
            value={form.weeksLeft}
            onChange={(e) => setField("weeksLeft", e.target.value)}
            aria-invalid={!!errors.weeksLeft}
            aria-describedby={errors.weeksLeft ? "weeksLeft-error" : undefined}
            disabled={busy}
          />
        </Field>
        <Field id="groupSize" label="How many people?" error={errors.groupSize}>
          <input
            id="groupSize"
            type="number"
            inputMode="numeric"
            min={1}
            step={1}
            placeholder="e.g. 4"
            value={form.groupSize}
            onChange={(e) => setField("groupSize", e.target.value)}
            aria-invalid={!!errors.groupSize}
            aria-describedby={errors.groupSize ? "groupSize-error" : undefined}
            disabled={busy}
          />
        </Field>
      </div>

      <Field
        id="currentSavings"
        label="How much has the group saved so far?"
        hint="Everyone's savings added together. Leave blank if you're starting from zero."
        error={errors.currentSavings}
      >
        <div className="money-input">
          <span aria-hidden="true">₱</span>
          <input
            id="currentSavings"
            type="number"
            inputMode="decimal"
            min={0}
            placeholder="0"
            value={form.currentSavings}
            onChange={(e) => setField("currentSavings", e.target.value)}
            aria-invalid={!!errors.currentSavings}
            aria-describedby={
              errors.currentSavings ? "currentSavings-error currentSavings-hint" : "currentSavings-hint"
            }
            disabled={busy}
          />
        </div>
      </Field>

      <fieldset className="expenses" disabled={busy}>
        <legend>What do you expect to spend on?</legend>
        <p className="hint">Optional. Add what you already know, like boat fare or a resort booking. The AI fills in the rest.</p>

        {form.expenses.map((row, index) => {
          const catKey = `expense-${row.id}-category`;
          const amtKey = `expense-${row.id}-amount`;
          return (
            <div className="expense-row" key={row.id}>
              <div className="expense-field">
                <label htmlFor={catKey} className={index === 0 ? "" : "sr-only"}>
                  Expense
                </label>
                <input
                  id={catKey}
                  type="text"
                  placeholder="e.g. Transport"
                  maxLength={100}
                  value={row.category}
                  onChange={(e) => setExpense(row.id, "category", e.target.value)}
                  aria-invalid={!!errors[catKey]}
                  aria-describedby={errors[catKey] ? `${catKey}-error` : undefined}
                />
                {errors[catKey] && (
                  <p className="field-error" id={`${catKey}-error`}>
                    {errors[catKey]}
                  </p>
                )}
              </div>
              <div className="expense-field">
                <label htmlFor={amtKey} className={index === 0 ? "" : "sr-only"}>
                  Amount (₱)
                </label>
                <input
                  id={amtKey}
                  type="number"
                  inputMode="decimal"
                  min={0}
                  placeholder="e.g. 6000"
                  value={row.amount}
                  onChange={(e) => setExpense(row.id, "amount", e.target.value)}
                  aria-invalid={!!errors[amtKey]}
                  aria-describedby={errors[amtKey] ? `${amtKey}-error` : undefined}
                />
                {errors[amtKey] && (
                  <p className="field-error" id={`${amtKey}-error`}>
                    {errors[amtKey]}
                  </p>
                )}
              </div>
              <button
                type="button"
                className="icon-btn remove-row"
                onClick={() => removeExpense(row.id)}
                aria-label={`Remove expense ${index + 1}${row.category ? ` (${row.category})` : ""}`}
                title="Remove"
              >
                <CloseIcon size={16} />
              </button>
            </div>
          );
        })}

        <button type="button" className="btn btn-ghost add-row" onClick={addExpense}>
          <PlusIcon size={16} /> Add expense
        </button>
      </fieldset>

      {hasErrors && (
        <p className="form-error" role="alert">
          Please fix the highlighted fields first.
        </p>
      )}

      <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={busy}>
        <SparkleIcon size={18} />
        {busy ? "Planning your trip…" : "Analyze & Plan with AI"}
      </button>
    </form>
  );
}

interface FieldProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}

function Field({ id, label, hint, error, children }: FieldProps) {
  return (
    <div className={`field${error ? " has-error" : ""}`}>
      <label htmlFor={id}>{label}</label>
      {children}
      {hint && (
        <p className="hint" id={`${id}-hint`}>
          {hint}
        </p>
      )}
      {error && (
        <p className="field-error" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}
