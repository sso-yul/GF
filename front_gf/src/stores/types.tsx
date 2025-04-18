import { JSX } from "react";

export interface SigninRequest {
    userId: string;
    rawPassword: string;
}

export interface SigninResponse {
    token: string;
    userId: string;
    userName: string;
    roleName: string;
    refreshToken: string;
}

export interface User {
    userId: string;
    userName: string;
    roleName?: string;
    userImg?: string;
}

export interface AuthState {
    isLoggedIn: boolean;
    user: User | null;
    token: string | null;

    // 인증 메서드
    checkAuth: () => boolean;
    signin: (credentials: SigninRequest) => Promise<void>;
    signout: () => Promise<void>;

    // 토큰 관리
    refreshAuth: () => Promise<string>;
    getToken: () => string | null;
    getUserInfo: () => User | null;
    updateToken: (newToken: string) => void;
}

export interface TableProps {
    tableId?: string;
    columns: string[];
    data: any[];
    inputColumns?: string[];
    selectColumns?: string[];
    checkboxColumns?: string[];
    multiCheckboxColumns?: string[];
    options?: { [key: string]: string[] };
    checkboxOptions?: { [key: string]: string[] };
    selectOptions?: { [key: string]: string[] };
    hiddenColumns?: string[];
    actionColumn?: string;
    actionColumns?: {
        [columnName: string]: {
            buttons: Array<{
                label: React.ReactNode;
                onClick: (row: any, index?: number) => void;
                className?: string;
            }>;
        };
    }
    actionButtons?: Array<{
        label: React.ReactNode;
        onClick: (row: any, rowIndex: number) => void;
        className?: string;
    }>;
    rowWrapperComponent?: (rowData: any, index: number, content: JSX.Element) => JSX.Element;
    onEdit?: (updatedData: any[]) => void;
}

export interface TableUser {
    ID: string;
    NAME: string;
    ROLE: string;
    originalRole: string;
}

export interface MenuCreateRequest {
    menuOrder: number;
    menuName: string;
    menuUrl: string;
    categoryNo: number;
    roleNos?: number[];
    permissions?: MenuPermissionRequest[];
}

export interface MenuUpdateRequest {
    menuNo: number;
    menuOrder: number;
    menuName: string;
    menuUrl: string;
    categoryNo: number;
    permissions?: MenuPermissionRequest[];
}

export interface MenuPermissionRequest {
    roleNo: number;
    permissionType: "READ" | "WRITE";
}

export interface MenuList {
    menuNo: number;
    menuName: string;
    menuUrl: string;
    menuOrder: number;

    categoryNo: number;
    categoryName: string;

    roles: Roles[];
    permissions: MenuPermissionRequest[];
}

export interface Roles {
    roleNo: number;
    roleName: string;
}

export interface MenuItem {
    menuNo: number;
    menuName: string;
    menuOrder: number;
}

export interface SortableMenuListProps {
    items: MenuItem[];
    onUpdateOrder: (updated: MenuItem[]) => void;
}

export interface PermissionState {
    hasPermission: boolean;
    checkPermission: (menuNo: number, permissionType: string, roleNo: number) => Promise<void>;
}