import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableRowProps {
  id: string | number;
  children: React.ReactNode;
}

const SortableRow = ({ id, children }: SortableRowProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab"
  };
  
  // children이 ReactElement인지 확인
  if (!React.isValidElement(children)) {
    return null; // 또는 기본값 처리
  }
  
  // 이제 children은 ReactElement로 타입이 보장됨
  const childrenWithProps = React.cloneElement(children, {
    ref: setNodeRef,
    style: {...(children.props.style || {}), ...style},
    ...attributes,
    ...listeners
  });
  
  return childrenWithProps;
};

export default SortableRow;