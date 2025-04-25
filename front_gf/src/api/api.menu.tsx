import { create } from "zustand";
import { MenuList, PermissionState } from "../stores/types";
import api from "./api";

// 권한에 맞는 메뉴 목록만 내비게이터에 출력
export const getAccessibleMenus = async (): Promise<MenuList[]> => {
    try {
        const response = await api.get<MenuList[]>("/menus/list");
        return response.data;
    } catch (error) {
        console.log("메뉴 목록을 불러오지 못함", error);
        return [];
    }
};

// customUrl에 따른 menuNo 추출
export const usePermissionStore = create<PermissionState>((set) => ({
    hasPermission: true,
    checkPermission: async (menuNo: number, permissionType: string, roleNo: number) => {
        try {
            const response = await api.post("/menus/permission-check", {
                menuNo: menuNo,
                permissionType: permissionType,
                roleNo: roleNo
            });
            set({ hasPermission: response.data.hasPermission });
        } catch (error) {
            console.error("권한 체크 실패", error);
            set({ hasPermission: false });
        }
    }
}));

export const getMenuNoByMenuUrl = async (customUrl: string) => {
    try {
        const response = await api.get(`/menus/menu-no?customUrl=${encodeURIComponent(customUrl)}`);
        return response.data;
    } catch (error) {
        console.error("URL로 menuNo 조회 실패:", error);
        throw error;
    }
};