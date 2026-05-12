import CreateAccountDrawer from "../../../components/CreateAccountDrawer";
import { Card, CardContent } from "../../../components/ui/card";
import { Plus } from "lucide-react";
import { getUserAccounts } from "../../../actions/Dashboard";
import AccountCard from "../../../components/AccountCard";
import { getCurrentBudget } from "../../../actions/Budget";
import BudgetProgress from "../../../components/BudgetProgress";
import AccountsGrid from "../../../components/AccountsGrid";

async function DashboardPage() {
  const accounts = await getUserAccounts();

  const defaultAccount = accounts?.find((account) => account.isDefault);
  let budgetData = null;
  if (defaultAccount) {
    budgetData = await getCurrentBudget(defaultAccount.id);
  }

  console.log(budgetData);
  return (
    <div className={"space-y-8"}>
      {/*Budget Progress*/}
      {defaultAccount && (
        <BudgetProgress
          initialBudget={budgetData?.budget}
          currentExpenses={budgetData?.currentExpenses || 0}
        />
      )}

      {/*Overview*/}

      {/*AccountsGrid*/}
      <AccountsGrid accounts={accounts} />
    </div>
  );
}
export default DashboardPage;
