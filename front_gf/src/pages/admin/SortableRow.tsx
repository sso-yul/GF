import React, { ReactElement, isValidElement, cloneElement } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// TR 요소의 예상 Props 타입 정의
interface RowProps {
    style?: React.CSSProperties;
    children: React.ReactNode;
    [key: string]: any; // 다른 가능한 props
}

// TD 요소의 예상 Props 타입 정의
interface CellProps {
    'data-column'?: string;
    style?: React.CSSProperties;
    [key: string]: any; // 다른 가능한 props
}

interface SortableRowProps {
    id: string | number;
    children: ReactElement<RowProps>; // 구체적인 TR 타입으로 명시
    handleColumn?: string;
}

const SortableRow = ({ id, children, handleColumn }: SortableRowProps): ReactElement | null => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    };

    // 내부의 td 요소들을 수정
    const modifiedChildren = cloneElement(
        children,
        {
            ref: setNodeRef,
            style: { ...(children.props.style || {}), ...style },
        },
        React.Children.map(children.props.children, (child) => {
            if (isValidElement<CellProps>(child) && child.props['data-column'] === handleColumn) {
                return cloneElement(child, {
                    ...child.props,
                    ...listeners,
                    ...attributes,
                    style: { cursor: 'grab', ...(child.props.style || {}) }
                });
            }
            return child;
        })
    );
    return modifiedChildren;
};

export default SortableRow;