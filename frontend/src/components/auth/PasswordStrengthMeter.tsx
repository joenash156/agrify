interface PasswordStrengthMeterProps {
  password: string;
  isDark: boolean;
}

export function getStrengthLevel(pw: string): 0 | 1 | 2 | 3 {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return 1;
  if (score <= 2) return 2;
  return 3;
}

export function PasswordStrengthMeter({
  password,
  isDark,
}: PasswordStrengthMeterProps) {
  if (!password) return null;

  const strengthLevel = getStrengthLevel(password);
  const strengthLabels = ["", "Weak", "Medium", "Strong"];
  const strengthColors = ["", "bg-red-500", "bg-amber-500", "bg-teal-500"] as const;
  const strengthTextColors = [
    "",
    "text-red-500",
    "text-amber-500",
    "text-teal-500",
  ] as const;

  return (
    <div className="mt-2 px-0.5">
      <div className="flex gap-1.5 mb-1">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={[
              "h-1 flex-1 rounded-full transition-colors duration-300",
              i <= strengthLevel
                ? strengthColors[strengthLevel]
                : isDark
                ? "bg-zinc-800"
                : "bg-zinc-200",
            ].join(" ")}
          />
        ))}
      </div>
      <p className={`text-[11px] font-semibold ${strengthTextColors[strengthLevel]}`}>
        Password strength: {strengthLabels[strengthLevel]}
      </p>
    </div>
  );
}
