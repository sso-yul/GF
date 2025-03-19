import React, { useId } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { ButtonProps } from "./Button.types";
import { useButtonStore } from "../../stores/buttonStore";
import "../../styles/button.css";

const Button: React.FC<ButtonProps & {navigateTo?: string}> = ({
    children,
    color = "blue",
    size = "medium",
    icon,
    iconPosition = "left",
    fullWidth = false,
    isLoading: propsIsLoding,
    loadingId,
    className = "",
    disabled,
    onClick,
    navigateTo,
    ...rest
}) => {

    const navigate = useNavigate();

    const generatedId = useId();
    const id = loadingId || generatedId;
    
    const loadingButtons = useButtonStore((state) => state.loadingButtons);
    const setLoading = useButtonStore((state) => state.setLoading);

    const isLoading = propsIsLoding || loadingButtons[id] || false;

    const sizeClasses = `button ${size ? size : 'medium'}`;
    const colorClasses = `button ${color}`;
    const widthClasses = fullWidth ? 'full-width' : '';
    const loadingClass = isLoading ? 'loading' : '';
    const disabledClass = disabled ? 'disabled' : '';

    const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {

        // navigateTo가 있을 경우 해당 경로로 이동
        if (navigateTo) {
            navigate(navigateTo);
            return;
        }

        if (!onClick) return;

        const result = onClick(event);

        if (result instanceof Promise) {
            try {
                setLoading(id, true);
                await result;
            } finally {
                setLoading(id, false);
            }
        }
    };

    const getIconSize = () => {
        switch (size) {
            case "small": return "icon-xs";
            case "large": return "icon-lg";
            default: return "icon-sm";
        }
    };

    const renderIcon = () => {
        if (!icon) return null;

        return (
            <FontAwesomeIcon
                icon={icon}
                className={`${getIconSize()} ${iconPosition === 'left' ? 'mr-2' : iconPosition === 'right' ? 'ml-2' : ''}`}
            />
        );
    };

    return (
        <button
            className={`${sizeClasses} ${colorClasses} ${widthClasses} ${loadingClass} ${disabledClass} ${className}`}
            disabled={disabled || isLoading}
            onClick={handleClick}
            {...rest}
        >
            {isLoading && (
                <FontAwesomeIcon
                    icon={faSpinner}
                    className={`${getIconSize()} mr-2 fa-spin`}
                />
            )}

            {icon && iconPosition === "left" && renderIcon()}
            {iconPosition !== "only" && children}
            {icon && iconPosition === "right" && renderIcon()}
            {!isLoading && icon && iconPosition === "only" && renderIcon()}
        </button>
    );
};

export default Button;