import { useState, useEffect, JSX } from "react"
import IconButton from "../button/IconButton";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { TableProps } from "../../stores/types"
import "../../styles/table.css";

const Table = ({
    columns,
    data,
    editableColumns = [],
    options={},
    onEdit
}: TableProps): JSX.Element => {
    const [tableData, setTableData] = useState(data);

    useEffect(() => {
        setTableData(data);
    }, [data]);

    const handleSelectChange = (column: string, value: string, index: number) => {
        const updatedData = [...tableData];
        updatedData[index] = {
            ...updatedData[index],
            [column]: value,
        };
        setTableData(updatedData);

        if (onEdit) {
            onEdit(updatedData);
        }
    }

    return (
        <>
            <table>
                <thead>
                    <tr>
                        {columns.map((column, index) => (
                            <th key={index}>{column}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {columns.map((column, colIndex) => {
                                // 만약 셀렉트 박스라면 조건문 타고 아니면 else 처리
                                if (editableColumns.includes(column)) {
                                    return (
                                        <td key={colIndex}>
                                            <select
                                                value={row[column]}
                                                onChange={(event) => handleSelectChange(column, event.target.value, rowIndex)}
                                            >
                                                {options[column]?.map((option, optionIndex) => (
                                                    <option
                                                        key={optionIndex}
                                                        value={option}
                                                    >
                                                        {option}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                    );
                                } else if (column === "") {
                                    return (
                                        <td key={colIndex}>
                                            <IconButton
                                                icon={faTrashCan}
                                                color="red"
                                                size="small"
                                                title="삭제"
                                            />
                                        </td>
                                    )
                                } else {
                                    return (
                                        <td key={colIndex}>
                                            {row[column]}
                                        </td>
                                    );
                                }
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
};
export default Table;


