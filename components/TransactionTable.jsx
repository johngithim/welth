"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Checkbox } from "./ui/checkbox";
import { format } from "date-fns";
import { categoryColors } from "../data/categories";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Badge } from "./ui/badge";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  Search,
  MoreHorizontal,
  RefreshCw,
  Trash,
  LucideX,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import useFetch from "../hooks/UseFetch";
import { bulkDeleteTransactions } from "../actions/Accounts";
import { toast } from "sonner";
import { BarLoader } from "react-spinners";

const RECURRING_INTERVALS = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  YEARLY: "Yearly",
};

const TransactionTable = ({ transactions }) => {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    field: "date",
    direction: "desc",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [recurringFilter, setRecurringFilter] = useState("");

  const {
    loading: deleteLoading,
    fn: deleteFn,
    data: deleted,
  } = useFetch(bulkDeleteTransactions);

  const filteredAndSortedTransactions = useMemo(() => {
    let result = [...transactions];

    const searchLower = searchTerm.toLowerCase();
    result = result.filter((transaction) =>
      transaction.description?.toLowerCase().includes(searchLower),
    );

    if (recurringFilter) {
      result = result.filter((transaction) => {
        if (recurringFilter === "recurring") return transaction.isRecurring;
        return !transaction.isRecurring;
      });
    }

    if (typeFilter) {
      result = result.filter((transaction) => transaction.type === typeFilter);
    }

    result.sort((a, b) => {
      let comparison = 0;

      switch (sortConfig.field) {
        case "date":
          comparison = new Date(a.date) - new Date(b.date);
          break;
        case "amount":
          comparison = a.amount - b.amount;
          break;
        case "category":
          comparison = a.category.localeCompare(b.category);
          break;
        default:
          comparison = 0;
      }

      return sortConfig.direction === "asc" ? comparison : -comparison;
    });

    return result;
  }, [transactions, searchTerm, typeFilter, recurringFilter, sortConfig]);

  const handleSort = (field) => {
    setSortConfig((current) => ({
      field,
      direction:
        current.field === field && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleSelect = (id) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  const handleSelectAll = (id) => {
    setSelectedIds((current) =>
      current.length === filteredAndSortedTransactions.length
        ? []
        : filteredAndSortedTransactions.map((transaction) => transaction.id),
    );
  };

  const handleBulkDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedIds.length} transactions?`,
      )
    ) {
      return;
    }

    await deleteFn(selectedIds);
  };

  useEffect(() => {
    if (deleted && !deleteLoading) {
      if (deleted.success) {
        toast.success("Transactions deleted successfully");
        setSelectedIds([]);
        router.refresh();
      } else if (deleted.success === false) {
        toast.error(deleted.error || "Failed to delete transactions");
      }
    }
  }, [deleted, deleteLoading, router]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setTypeFilter("");
    setRecurringFilter("");
    setSelectedIds([]);
  };

  return (
    <div className={"space-y-4"}>
      {deleteLoading && (
        <BarLoader className={"mt-4"} width={"100%"} color={"#9333ea"} />
      )}

      <div className={"flex flex-col sm:flex-row gap-4"}>
        <div className={"relative flex-1"}>
          <Search
            className={"absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"}
          />
          <Input
            className={"pl-8"}
            placeholder={"Search transactions..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className={"flex gap-2"}>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INCOME">Income</SelectItem>
              <SelectItem value="EXPENSE">Expense</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={recurringFilter}
            onValueChange={(value) => setRecurringFilter(value)}
          >
            <SelectTrigger className={"w-[150px]"}>
              <SelectValue placeholder="All Transactions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recurring">Recurring only</SelectItem>
              <SelectItem value="non-recurring">Non-recurring only</SelectItem>
            </SelectContent>
          </Select>

          {selectedIds.length > 0 && (
            <div className={"flex items-center gap-2"}>
              <Button
                variant={"destructive"}
                size={"sm"}
                onClick={handleBulkDelete}
              >
                <Trash className={"h-4 w-4 mr-1"} />
                Delete Selected({selectedIds.length})
              </Button>
            </div>
          )}

          {(searchTerm || typeFilter || recurringFilter) && (
            <Button
              variant={"outline"}
              size={"icon"}
              onClick={handleClearFilters}
              title={"Cleat Filters"}
            >
              <LucideX className={"h-4 w-5"} />
            </Button>
          )}
        </div>
      </div>

      <div className={"rounded-md border"}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  onCheckedChange={handleSelectAll}
                  checked={
                    selectedIds.length ===
                      filteredAndSortedTransactions.length &&
                    filteredAndSortedTransactions.length > 0
                  }
                />
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("date")}
              >
                <div className={"flex items-center"}>
                  Date{" "}
                  {sortConfig.field === "date" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className={"ml-1 h-4 w-4"} />
                    ) : (
                      <ChevronDown className={"ml-1 h-4 w-4"} />
                    ))}
                </div>
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("category")}
              >
                <div className={"flex items-center"}>
                  Category
                  {sortConfig.field === "category" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className={"ml-1 h-4 w-4"} />
                    ) : (
                      <ChevronDown className={"ml-1 h-4 w-4"} />
                    ))}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("amount")}
              >
                <div className={"flex items-center justify-end"}>
                  Amount{" "}
                  {sortConfig.field === "amount" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className={"ml-1 h-4 w-4"} />
                    ) : (
                      <ChevronDown className={"ml-1 h-4 w-4"} />
                    ))}
                </div>
              </TableHead>
              <TableHead>Recurring</TableHead>
              <TableHead className={"w-[50px]"} />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedTransactions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className={"text-center text-muted-foreground"}
                >
                  No Transactions Found
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedTransactions.map((transaction, index) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <Checkbox
                      onCheckedChange={() => handleSelect(transaction.id)}
                      checked={selectedIds.includes(transaction.id)}
                    />
                  </TableCell>
                  <TableCell>
                    {format(new Date(transaction.date), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell className={"capitalize"}>
                    <span
                      style={{
                        background: categoryColors[transaction.category],
                      }}
                      className={"px-2 py-1 rounded text-white text-sm"}
                    >
                      {transaction.category}
                    </span>
                  </TableCell>
                  <TableCell
                    className="text-right font-medium"
                    style={{
                      color: transaction.type === "EXPENSE" ? "red" : "green",
                    }}
                  >
                    {transaction.type === "EXPENSE" ? "-" : "+"}${" "}
                    {transaction.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {transaction.isRecurring ? (
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge
                            variant={"outline"}
                            className={
                              "gap-1 bg-purple-100 text-purple-700 hover:bg-purple-200"
                            }
                          >
                            <RefreshCw className={"h-3 w-3"} />
                            {RECURRING_INTERVALS[transaction.recurringInterval]}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className={"text-sm"}>
                            <div className={"font-medium"}>Next Date:</div>
                            <div>
                              {format(
                                new Date(transaction.nextRecurringDate),
                                "MMM dd, yyyy",
                              )}
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <Badge variant={"outline"} className={"gap-1"}>
                        <Clock className={"h-3 w-3"} />
                        One-time
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button className={"h-8 w-8 p-0"} variant={"ghost"}>
                          <MoreHorizontal className={"h-4 w-4"} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(
                              `/transaction/create?edit=${transaction.id}`,
                            )
                          }
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className={"text-destructive"}
                          onClick={() => deleteFn([transaction.id])}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
export default TransactionTable;
