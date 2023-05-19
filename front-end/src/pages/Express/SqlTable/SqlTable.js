import React from "react";
import styled from "styled-components";
import { useTable } from "react-table";

const Table = ({ data }) => {
    const Table = styled.table`
        border: 1px solid white;
        border-collapse: collapse;
        width: 100%;
        & th {
            background-color: #4f4f4f;
            border: 1px solid white;
            color: #e6db74;
            font-weight: bold;
            padding: 0.5rem;
            text-align: left;
        }
        & td {
            background-color: #a9a9a9;
            border: 1px solid white;
            padding: 0.5rem;
        }
    `;
    const columns = React.useMemo(() => {
        if (data.length > 0) {
            return Object.keys(data[0]).map((key) => ({
                Header: key,
                accessor: key,
            }));
        } else {
            return [];
        }
    }, [data]);

    const tableInstance = useTable({ columns, data });

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

    return (
        <Table {...getTableProps()}>
            <thead>
                {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                            <th {...column.getHeaderProps()}>{column.render("Header")}</th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map((row, i) => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map((cell) => {
                                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
                            })}
                        </tr>
                    );
                })}
            </tbody>
        </Table>
    );
};

export default Table;
