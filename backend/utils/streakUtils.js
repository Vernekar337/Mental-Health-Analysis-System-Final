exports.calculateStreak = (dates) => {
  if (!dates.length) return 0

  const uniqueDays = [
    ...new Set(
      dates.map((d) => d.toISOString().slice(0, 10))
    )
  ].sort()

  let streak = 1
  let maxStreak = 1

  for (let i = 1; i < uniqueDays.length; i++) {
    const prev = new Date(uniqueDays[i - 1])
    const curr = new Date(uniqueDays[i])

    const diff =
      (curr - prev) / (1000 * 60 * 60 * 24)

    if (diff === 1) {
      streak++
      maxStreak = Math.max(maxStreak, streak)
    } else {
      streak = 1
    }
  }

  return maxStreak
}
