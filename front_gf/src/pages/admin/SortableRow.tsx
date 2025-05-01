import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableRowProps {
    id: string | number;
    children: React.ReactNode;
    handleColumn?: string;
}

const SortableRow = ({ id, children, handleColumn }: SortableRowProps) => {
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

    // children이 ReactElement인지 확인
    if (!React.isValidElement(children)) {
        return null;
    }

    // tr 내부의 td 요소들을 찾아서 handleColumn과 일치하는 열에만 드래그 핸들 기능 적용
    const modifiedChildren = React.cloneElement(children, {
        ref: setNodeRef,
        style: {...(children.props.style || {}), ...style},
        children: React.Children.map(children.props.children, (child) => {
            // child가 유효한 요소이고 data-column 속성이 handleColumn과 일치하는 경우에만 listeners와 attributes 적용
            if (React.isValidElement(child) && child.props['data-column'] === handleColumn) {
                return React.cloneElement(child, {
                    ...listeners,
                    ...attributes,
                    style: { cursor: 'grab', ...child.props.style }
                });
            }
            return child;
        })
    });

    return modifiedChildren;
};

export default SortableRow;