import { getUserAccounts } from "../../../../actions/Dashboard";
import { defaultCategories } from "../../../../data/categories";
import AddTransactionForm from "../../../../components/AddTransactionForm";

const Page = async () => {
  const accounts = await getUserAccounts();
  return (
    <div className={"max-w-3xl mx-auto px-5"}>
      <h1 className={"text-5xl gradient-title mb-8"}>Add Transactions</h1>
      <AddTransactionForm accounts={accounts} categories={defaultCategories} />
    </div>
  );
};
export default Page;
