"use client";

import React, { useEffect } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Switch } from "./ui/switch";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { updateDefaultAccount } from "../actions/Accounts";
import { toast } from "sonner";
import useFetch from "../hooks/UseFetch";

const AccountCard = ({ account, selectable = false, selected = false, onToggleSelect }) => {
  const { name, type, balance, id, isDefault } = account;

  const {
    loading: updateDefaultLoading,
    fn: updateDefaultFn,
    data: updateAccount,
    error,
  } = useFetch(updateDefaultAccount);

  const handleDefaultChange = async (event) => {
    event.preventDefault();

    if (isDefault) {
      toast.warning("You need at least 1 default account");
      return;
    }
    await updateDefaultFn(id);
  };

  useEffect(() => {
    if (updateAccount?.success)
      toast.success("Default Account updated successfully.");
  }, [updateAccount, updateDefaultLoading]);

  useEffect(() => {
    if (error) toast.error(error.message || "Failed to update account");
  }, [error]);

  const body = (
    <>
      <CardHeader
        className={"flex flex-row items-center justify-between space-y-0 pb-2"}
      >
        <div className={"relative w-full"}>
          {selectable && (
            <div
              className={"absolute -left-1 -top-1 z-10"}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleSelect?.(id);
              }}
            >
              <input
                type="checkbox"
                checked={selected}
                readOnly
                className={"h-4 w-4 accent-primary cursor-pointer"}
              />
            </div>
          )}
          <CardTitle className={"text-sm font-medium capitalize pl-4"}>
            {name}
          </CardTitle>
        </div>
        <Switch
          checked={isDefault}
          onClick={handleDefaultChange}
          disabled={updateDefaultLoading}
        />
      </CardHeader>
      <CardContent>
        <div className={"text-2xl font-bold"}>${parseFloat(balance).toFixed(2)}</div>
        <p className={"text-xs text-muted-foreground capitalize"}>
          {type.charAt(0) + type.slice(1).toLowerCase()} Account
        </p>
      </CardContent>
      <CardFooter className={"flex justify-between text-sm text-muted-foreground"}>
        <div className={"flex items-center"}>
          <ArrowUpRight className={"mr-1 h-4 w-4 text-green-500"} />
          Income
        </div>
        <div className={"flex items-center"}>
          <ArrowDownRight className={"mr-1 h-4 w-4 text-red-500"} />
          Expense
        </div>
      </CardFooter>
    </>
  );

  return (
    <Card
      className={"hover:shadow-md transition-shadow group relative"}
      onClick={(e) => {
        if (selectable) {
          e.preventDefault();
          onToggleSelect?.(id);
        }
      }}
    >
      {selectable ? body : <Link href={`/account/${id}`}>{body}</Link>}
    </Card>
  );
};
export default AccountCard;
