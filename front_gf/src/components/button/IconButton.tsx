// 아이콘만 있는 버튼 편하게 쓰기 위해 따로 뺌
import React from "react";
import Button from "./Button";
import { ButtonProps } from "./Button.types";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

type IconButtonProps = Omit<ButtonProps, "iconPosition"> & {
    icon: IconDefinition;
    title?: string;
    navigateTo?: string;
};

const IconButton: React.FC<IconButtonProps> = ({
    icon,
    title,
    navigateTo,
    ...rest
}) => {
    return (
        <Button
            icon={icon}
            iconPosition="only"
            aria-label={title}
            navigateTo={navigateTo}
            title={title}
            {...rest}
        >
            {null}
        </Button>
    );
};

export default IconButton;