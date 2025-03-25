import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

// 버튼 크기
export type ButtonSize = "xsmall" | "small" | "medium" | "large";
// 버튼 위치 ( 텍스트의 왼쪽, 텍스트의 오른쪽, 텍스트 없이 아이콘만 있음)
export type ButtonPosition = "left" | "right" | "only";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    size?: ButtonSize;
    icon?: IconDefinition;
    iconPosition: ButtonPosition;
    fullWidth?: boolean;
    isLoading?: boolean;
    loadingId?: string;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void | Promise<any>;
}