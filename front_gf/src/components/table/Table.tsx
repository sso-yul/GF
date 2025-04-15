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
    checkboxOptions = {},
    options = {},
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
        
        // 초기화: 해당 컬럼의 데이터가 배열이 아니면 빈 배열로 초기화
        if (!Array.isArray(updatedData[index][column])) {
            updatedData[index][column] = [];
        }
        
        const currentValues = [...updatedData[index][column]];
        
        if (checked) {
            // 체크된 경우 값 추가 (중복 방지)
            if (!currentValues.includes(option)) {
                currentValues.push(option);
            }
        } else {
            // 체크 해제된 경우 값 제거
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
                                // 만약 셀렉트 박스라면 조건문 타고
                                if (selectColumns.includes(column)) {
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
                                } // 만약 input 박스라면 조건문 타고
                                else if (inputColumns.includes(column)) {
                                    return (
                                        <td key={colIndex}>
                                            <input
                                                type="text"
                                                value={row[column] || ''}
                                                onChange={(event) => handleInputChange(column, event.target.value, rowIndex)}
                                            />
                                        </td>
                                    );
                                } // 만약 check 박스라면 조건문 타고
                                else if (checkboxColumns.includes(column)) {
                                    return (
                                        <td key={colIndex}>
                                            <input
                                                type="checkbox"
                                                checked={Boolean(row[column])}
                                                onChange={(event) => handleCheckboxChange(column, event.target.checked, rowIndex)}
                                            />
                                        </td>
                                    );
                                } // 만약 여러 체크박스가 필요한 컬럼이라면
                                else if (multiCheckboxColumns.includes(column)) {
                                    return (
                                        <td key={colIndex} className="multi-checkbox-cell">
                                            {checkboxOptions[column]?.map((option, optionIndex) => {
                                                const isChecked = Array.isArray(row[column]) && row[column].includes(option);
                                                return (
                                                    <div key={optionIndex} className="checkbox-item">
                                                        <input
                                                            type="checkbox"
                                                            id={`checkbox-${rowIndex}-${column}-${optionIndex}`}
                                                            checked={isChecked}
                                                            onChange={(event) => handleMultiCheckboxChange(column, option, event.target.checked, rowIndex)}
                                                        />
                                                        <label htmlFor={`checkbox-${rowIndex}-${column}-${optionIndex}`}>
                                                            {option}
                                                        </label>
                                                    </div>
                                                );
                                            })}
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


