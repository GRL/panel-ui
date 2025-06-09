import {useAppSelector} from "@/hooks.ts";
import React from "react";
import {ColumnDef, flexRender, getCoreRowModel, useReactTable} from "@tanstack/react-table";
import {TaskStatusResponseOut} from "@/api";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {formatDistanceToNow} from 'date-fns'
import {formatSecondsVerbose} from "@/lib/utils.ts";
import {Calendar} from "@/components/ui/calendar"

export const TaskAttemptTable = () => {
    const data = useAppSelector(state => state.taskStatus)

    const columns: ColumnDef<TaskStatusResponseOut>[] = [
        {
            accessorKey: "started",
            header: "Started",
            cell: ({getValue}) => formatDistanceToNow(new Date(getValue()), {addSuffix: true})
        },
        {
            accessorKey: "finished",
            header: "Duration",
            cell: ({row}) => {
                const started = new Date(row.original.started);
                const finished = new Date(row.original.finished);
                const durationInSec = Math.floor((finished.getTime() - started.getTime()) / 1000);
                return formatSecondsVerbose(durationInSec);
            }
        }, {
            accessorKey: "status",
            header: "Status",
        }, {
            accessorKey: "status_code_1",
            header: "Status 1",
        }, {
            accessorKey: "status_code_2",
            header: "Status 2",
        }
    ]

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div className="border rounded-md mt-5">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>

                <TableBody>
                    {
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}

const TaskAttemptHistoryPage = () => {
    const taskStatuses = useAppSelector(state => state.taskStatus)

    const countByDate: Record<string, number> = taskStatuses.reduce((acc, item) => {
        const date: string = item.started.split("T")[0]
        acc[date] = (acc[date] || 0) + 1
        return acc
    }, {} as Record<string, number>)

    return (
        <>
            <Calendar
                mode="single"
                numberOfMonths={2}
                className="rounded-lg border shadow-sm"

                // dayPickerProps={{
                //     modifiersClassNames: {
                //         highlighted: "bg-blue",
                //     },
                //     modifiers: {
                //         highlighted: (date: Date) =>
                //             !!countByDate[date.toISOString().split("T")[0]],
                //     },
                //     showOutsideDays: true,
                // }}

                // dayClassName={(date) => {
                //     const key = date.toISOString().split("T")[0]
                //     console.log(key)
                //     return (countByDate[key] ?? 0) > 0 ? "bg-blue-200 text-blue-800" : "bg-white"
                // }}
            />
            <TaskAttemptTable/>
        </>
    )
}

export {
    TaskAttemptHistoryPage
}