import React from "react";
import {useSelector} from "react-redux";
import {selectUserAge, selectUserGender, selectUserUpkAnswers, selectUserZip} from "@/models/userUpkAnswerSlice.ts";
import {titleCase} from "@/lib/utils.ts";
import { formatDistanceToNow } from 'date-fns'

import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Calendar, MapPin, User, PersonStanding} from "lucide-react";
import {UserProfileKnowledge, UserProfile} from "@/api";
import {ColumnDef, flexRender, getCoreRowModel, useReactTable} from "@tanstack/react-table";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {useAppSelector} from "@/hooks.ts";

export const UpkGrid = () => {

    const columns: ColumnDef<UserProfileKnowledge>[] = [
        {
            accessorKey: "property_label",
            header: "Label",
        },
        {
            accessorKey: "answer",
            header: "Answer",
            cell: ({getValue}) => getValue()[0].value ?? getValue()[0].label
        },
    ]

    const data = useSelector(selectUserUpkAnswers)

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div className="border rounded-md mt-6">
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

export const ContactCard = () => {

    const age = useSelector(selectUserAge)
    const zip = useSelector(selectUserZip)
    const gender = useSelector(selectUserGender)

    const userProfile: UserProfile = useAppSelector(state => state.userProfile)

    const created: string = formatDistanceToNow(new Date(userProfile.user.created), { addSuffix: true })

    return (
        <Card className="w-full max-w-sm shadow-md rounded-2xl p-4">
            <CardHeader className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="text-gray-500"/>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <PersonStanding className="w-4 h-4"/>
                    <span>Created: {created}</span>
                </div>
            </CardHeader>

            <CardContent className="space-y-2 pt-2">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <User className="w-4 h-4"/>
                    <span>{titleCase(gender as string) ?? " - "}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4"/>
                    <span>{age ?? " - "} years old</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4"/>
                    <span>{zip ?? " - "}</span>
                </div>
            </CardContent>
        </Card>
    );
};


const Demographics = () => {

    return (
        <>
            <ContactCard/>
            <UpkGrid/>
        </>
    )
}

export {
    Demographics
}