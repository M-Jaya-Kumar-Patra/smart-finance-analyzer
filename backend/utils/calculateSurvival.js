export const calculateSurvival = (transactions) => {
  let income = 0;
  let expense = 0;

  transactions.forEach(t => {
    if (t.type === "income") income += t.amount;
    else expense += t.amount;
  });

  const remainingBalance = income - expense;

  const today = new Date();
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const remainingDays = lastDay.getDate() - today.getDate();

  const safeDailyLimit =
    remainingDays > 0 ? remainingBalance / remainingDays : remainingBalance;

  return {
    income,
    expense,
    remainingBalance,
    remainingDays,
    safeDailyLimit
  };
};