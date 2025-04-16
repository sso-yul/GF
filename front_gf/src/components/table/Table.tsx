import { useState, useEffect, JSX } from "react"
import IconButton from "../button/IconButton";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { TableProps } from "../../stores/types"
import "../../styles/table.css";

const Table = ({
    columns,
    data = [],
    selectColumns = [],
    inputColumns = [],
    checkboxColumns = [],
    multiCheckboxColumns = [],
    options = {},
    checkboxOptions = {},
    selectOptions = {},
    hiddenColumns = [],
    actionColumn,
    actionButtons = [],
    rowWrapperComponent,
    onEdit
}: TableProps): JSX.Element => {
    const [tableData, setTableData] = useState(data);

    useEffect(() => {
        const deepCopiedData = JSON.parse(JSON.stringify(data));
        setTableData(deepCopiedData);
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

    const handleInputChange = (column: string, value: string, index: number) => {
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
    
    const handleCheckboxChange = (column: string, checked: boolean, index: number) => {
        const updatedData = [...tableData];
        updatedData[index] = {
            ...updatedData[index],
            [column]: checked,
        };
        setTableData(updatedData);

        if (onEdit) {
            onEdit(updatedData);
        }
    }

    const handleMultiCheckboxChange = (column: string, option: string, checked: boolean, index: number) => {
        const updatedData = [...tableData];
        
        if (!Array.isArray(updatedData[index][column])) {
            updatedData[index][column] = [];
        }
        
        const currentValues = [...updatedData[index][column]];
        
        if (checked) {
            if (!currentValues.includes(option)) {
                currentValues.push(option);
            }
        } else {
            const optionIndex = currentValues.indexOf(option);
            if (optionIndex !== -1) {
                currentValues.splice(optionIndex, 1);
            }
        }
        
        updatedData[index][column] = currentValues;
        setTableData(updatedData);

        if (onEdit) {
            onEdit(updatedData);
        }
    }

    const handleDeleteRow = (index: number) => {
        const updatedData = [...tableData];
        updatedData.splice(index, 1);
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
                            !hiddenColumns.includes(column) && (
                                <th key={index}>{column}</th>
                            )
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((row, rowIndex) => {
                        const rowContent = (
                            <tr key={rowIndex}>
                                {columns.map((column, colIndex) => {
                                    if (hiddenColumns.includes(column)) return null;

                                    if (selectColumns.includes(column)) {
                                        return (
                                            <td key={colIndex}>
                                                <select
                                                    value={row[column] || ''}
                                                    onChange={(e) =>
                                                        handleSelectChange(column, e.target.value, rowIndex)
                                                    }
                                                >
                                                    <option value="">선택하세요</option>
                                                    {(selectOptions[column] || options[column])?.map((option, i) => (
                                                        <option key={i} value={option}>
                                                            {option}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                        );
                                    } else if (inputColumns.includes(column)) {
                                        return (
                                            <td key={colIndex}>
                                                <input
                                                    type="text"
                                                    value={row[column] || ''}
                                                    onChange={(e) =>
                                                        handleInputChange(column, e.target.value, rowIndex)
                                                    }
                                                />
                                            </td>
                                        );
                                    } else if (checkboxColumns.includes(column)) {
                                        return (
                                            <td key={colIndex}>
                                                <input
                                                    type="checkbox"
                                                    checked={Boolean(row[column])}
                                                    onChange={(e) =>
                                                        handleCheckboxChange(column, e.target.checked, rowIndex)
                                                    }
                                                />
                                            </td>
                                        );
                                    } else if (multiCheckboxColumns.includes(column)) {
                                        return (
                                            <td key={colIndex} className="multi-checkbox-cell">
                                                {checkboxOptions[column]?.map((option, i) => {
                                                    const isChecked =
                                                        Array.isArray(row[column]) && row[column].includes(option);
                                                    return (
                                                        <div key={i} className="checkbox-item">
                                                            <input
                                                                type="checkbox"
                                                                id={`checkbox-${rowIndex}-${column}-${i}`}
                                                                checked={isChecked}
                                                                onChange={(e) =>
                                                                    handleMultiCheckboxChange(
                                                                        column,
                                                                        option,
                                                                        e.target.checked,
                                                                        rowIndex
                                                                    )
                                                                }
                                                            />
                                                            <label htmlFor={`checkbox-${rowIndex}-${column}-${i}`}>
                                                                {option}
                                                            </label>
                                                        </div>
                                                    );
                                                })}
                                            </td>
                                        );
                                    } else if (column === actionColumn) {
                                        return (
                                            <td key={colIndex} className="action-cell">
                                                {actionButtons.map((button, i) => (
                                                    <button
                                                        key={i}
                                                        className={`action-button ${button.className || ''}`}
                                                        onClick={() => button.onClick(row, rowIndex)}
                                                    >
                                                        {button.label}
                                                    </button>
                                                ))}
                                            </td>
                                        );
                                    } else if (column === "") {
                                        return (
                                            <td key={colIndex}>
                                                <IconButton
                                                    icon={faXmark}
                                                    color="red"
                                                    size="small"
                                                    title="삭제"
                                                    onClick={() => handleDeleteRow(rowIndex)}
                                                />
                                            </td>
                                        );
                                    } else {
                                        return <td key={colIndex}>{row[column]}</td>;
                                    }
                                })}
                            </tr>
                        );

                        return rowWrapperComponent
                            ? rowWrapperComponent(row, rowIndex, rowContent)
                            : rowContent;
                    })}
                </tbody>

            </table>
        </>
    );
};

export default Table;