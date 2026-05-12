import { notFound } from "next/navigation";
import { getAccountWithTransactions } from "../../../../actions/Accounts";
import { Suspense } from "react";
import { Quantum } from "ldrs/react";
import "ldrs/react/Quantum.css";
import TransactionTable from "../../../../components/TransactionTable";
import AccountChart from "../../../../components/AccountChart";
import { BarLoader } from "react-spinners";

export default async function AccountPage({ params }) {
  const accountData = await getAccountWithTransactions(params.id);

  if (!accountData) {
    notFound();
  }

  const { transactions, ...account } = accountData;

  return (
    <div className="px-5 space-y-8">
      <div className={"flex items-center justify-between gap-4"}>
        <div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight gradient-title capitalize">
            {account.name}
          </h1>
          <p className="text-muted-foreground capitalize">
            {account?.type &&
              account.type.charAt(0) + account.type.slice(1).toLowerCase()}
            Account
          </p>
        </div>

        <div className="text-right pb-2">
          <div className="text-xl sm:text-2xl font-bold">
            ${Number(account?.balance ?? 0).toFixed(2)}
          </div>
          <p className="text-sm text-muted-foreground">
            {account?._count?.transactions ?? 0} Transactions
          </p>
        </div>
      </div>

      {/* Chart Section */}
      <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}
      >
        <AccountChart transactions={transactions} />
      </Suspense>

      {/*/!* Transactions Table *!/*/}
      <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}
      >
        <TransactionTable transactions={transactions} />
      </Suspense>
    </div>
  );
}
