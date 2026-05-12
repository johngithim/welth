"use client";

import { useMemo, useState, useEffect } from "react";
import { Button } from "./ui/button";
import AccountCard from "./AccountCard";
import useFetch from "../hooks/UseFetch";
import { bulkDeleteAccounts } from "../actions/Accounts";
import { Trash2, X } from "lucide-react";
import { toast } from "sonner";
import CreateAccountDrawer from "./CreateAccountDrawer";
import { Card, CardContent } from "./ui/card";
import { Plus } from "lucide-react";

const AccountsGrid = ({ accounts }) => {
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  const {
    loading: deleting,
    data: deleteResult,
    error: deleteError,
    fn: deleteFn,
  } = useFetch(bulkDeleteAccounts);

  const toggleSelectionMode = () => {
    if (selectionMode) {
      // exiting selection mode clears selection
      setSelectedIds([]);
      setSelectionMode(false);
    } else {
      setSelectionMode(true);
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleDelete = async () => {
    if (selectedIds.length === 0) return;
    await deleteFn(selectedIds);
  };

  useEffect(() => {
    if (deleteResult?.success) {
      toast.success(
        `Deleted ${selectedIds.length} account${selectedIds.length > 1 ? "s" : ""}`,
      );
      // Reset UI state; revalidation will refresh the list server-side
      setSelectedIds([]);
      setSelectionMode(false);
    }
  }, [deleteResult]);

  useEffect(() => {
    if (deleteError) {
      toast.error(deleteError.message || "Failed to delete accounts");
    }
  }, [deleteError]);

  const deleteLabel = useMemo(() => {
    if (!selectionMode) return "Delete Accounts";
    const n = selectedIds.length;
    return n > 0 ? `Delete (${n})` : "Cancel";
  }, [selectionMode, selectedIds.length]);

  const onDeleteButtonClick = () => {
    if (!selectionMode) {
      setSelectionMode(true);
      return;
    }
    if (selectedIds.length === 0) {
      // acts as cancel
      setSelectionMode(false);
      return;
    }
    handleDelete();
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-end">
        <Button
          variant={selectionMode ? "destructive" : "secondary"}
          size="sm"
          onClick={onDeleteButtonClick}
          disabled={deleting}
          className="gap-2"
        >
          {selectionMode && selectedIds.length === 0 ? (
            <X className="h-4 w-4" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
          {deleteLabel}
        </Button>
      </div>

      <div className={"grid gap-4 md:grid-cols-2 grid-cols-3"}>
        <CreateAccountDrawer>
          <Card
            className={
              "hover:shadow-md transition-shadow cursor-pointer border-dashed"
            }
          >
            <CardContent
              className={
                "flex flex-col items-center justify-center text-muted-foreground h-full pt-5"
              }
            >
              <Plus className={"h-10 w-10 mb-2"} />
              <p className={"text-sm font-medium"}>Add New Account</p>
            </CardContent>
          </Card>
        </CreateAccountDrawer>

        {accounts?.length > 0 &&
          accounts.map((account) => (
            <AccountCard
              key={account.id}
              account={account}
              selectable={selectionMode}
              selected={selectedIds.includes(account.id)}
              onToggleSelect={toggleSelect}
            />
          ))}
      </div>
    </div>
  );
};

export default AccountsGrid;
