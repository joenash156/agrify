import { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { Modal } from "./Modal";
import { extractErrorMessage } from "../../utils/errors";

export type FieldValue = string | number;

export interface SelectOption {
  value: string;
  label: string;
}

export interface FieldConfig {
  name: string;
  label: string;
  type: "text" | "number" | "date" | "time" | "select" | "textarea";
  options?: SelectOption[];
  required?: boolean;
  step?: string;
  placeholder?: string;
  /** Locked for editing — shown but greyed out (e.g. a foreign key that shouldn't move after creation). */
  disabled?: boolean;
}

interface EntityFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  fields: FieldConfig[];
  initialValues: Record<string, FieldValue>;
  onSubmit: (values: Record<string, FieldValue>) => Promise<void>;
  submitLabel?: string;
  /** Read-only "View" mode — renders every field disabled with no submit action. */
  readOnly?: boolean;
}

/**
 * Schema-driven create/edit/view modal shared by every entity page — each page only
 * supplies its field list and a submit handler that calls the matching service method.
 */
export function EntityFormModal({
  isOpen,
  onClose,
  title,
  subtitle,
  fields,
  initialValues,
  onSubmit,
  submitLabel = "Save",
  readOnly = false,
}: EntityFormModalProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [values, setValues] = useState<Record<string, FieldValue>>(initialValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset the form whenever the modal transitions to open, so each new create/edit/view
  // starts from the caller's latest initialValues — done during render (React's endorsed
  // pattern for "adjusting state when a prop changes") rather than in an effect, since a
  // synchronous setState in an effect body would trigger an extra, avoidable render pass.
  const [wasOpen, setWasOpen] = useState(isOpen);
  if (isOpen !== wasOpen) {
    setWasOpen(isOpen);
    if (isOpen) {
      setValues(initialValues);
      setError(null);
    }
  }

  const handleChange = (name: string, raw: string, type: FieldConfig["type"]) => {
    setValues((prev) => ({ ...prev, [name]: type === "number" ? (raw === "" ? "" : Number(raw)) : raw }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (readOnly || isSubmitting) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit(values);
      onClose();
    } catch (err) {
      setError(extractErrorMessage(err, "Something went wrong. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const labelCls = `block text-xs font-bold uppercase tracking-wider mb-1.5 ${isDark ? "text-zinc-300" : "text-zinc-800"}`;
  const inputCls = `w-full px-3.5 py-2.5 rounded-xl text-sm border outline-none transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
    isDark
      ? "bg-zinc-800/60 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus:border-teal-500"
      : "bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:border-teal-500"
  }`;
  const cancelBtn = isDark
    ? "border-zinc-700 text-zinc-300 hover:bg-zinc-800"
    : "border-zinc-200 text-zinc-700 hover:bg-zinc-100";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} subtitle={subtitle}>
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {fields.map((field) => {
          const value = values[field.name] ?? "";
          const isDisabled = readOnly || field.disabled || isSubmitting;
          return (
            <div key={field.name}>
              <label className={labelCls}>{field.label}</label>
              {field.type === "select" ? (
                <select
                  value={String(value)}
                  onChange={(e) => handleChange(field.name, e.target.value, field.type)}
                  required={field.required}
                  disabled={isDisabled}
                  className={inputCls}
                >
                  <option value="" disabled>
                    {field.placeholder ?? "Select..."}
                  </option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : field.type === "textarea" ? (
                <textarea
                  value={String(value)}
                  onChange={(e) => handleChange(field.name, e.target.value, field.type)}
                  required={field.required}
                  disabled={isDisabled}
                  placeholder={field.placeholder}
                  rows={3}
                  className={`${inputCls} resize-none`}
                />
              ) : (
                <input
                  type={field.type}
                  value={String(value)}
                  onChange={(e) => handleChange(field.name, e.target.value, field.type)}
                  required={field.required}
                  disabled={isDisabled}
                  placeholder={field.placeholder}
                  step={field.step}
                  className={inputCls}
                />
              )}
            </div>
          );
        })}

        {error && (
          <div
            className={`p-3 rounded-xl border text-xs font-semibold ${
              isDark ? "bg-red-950/40 border-red-800 text-red-400" : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            {error}
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${cancelBtn}`}
          >
            {readOnly ? "Close" : "Cancel"}
          </button>
          {!readOnly && (
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : submitLabel}
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
}

export default EntityFormModal;
