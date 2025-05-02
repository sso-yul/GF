import api from "./api";
import  { MenuCreateRequest, MenuList, MenuUpdateRequest } from "../stores/types";


export const getRoles = async (): Promise<{roleName: string, roleNo: number}[]> => {
    try {
        const response = await api.get<{roleName: string, roleNo: number}[]>("/manager/roles");
        return response.data;
    } catch (error) {
        console.error("역할 목록을 불러오지 못함", error);
        throw error;
    }
};

export const updateUserRoles = async (updates: { userId: string; roleNo: number }[]): Promise<void> => {
    try {
        await api.put("/manager/roles/update", updates);
    } catch (error) {
        console.error("역할 업데이트 실패", error);
        throw error;
    }
};

export const createMenu = async (menuData: MenuCreateRequest): Promise<any> => {
    try {
        await api.post("/admin/menus/create", menuData);
    } catch (error) {
        console.error("메뉴 생성 실패");
        throw error;
    }
}

export const updateMenu = async (menuUpdateData: MenuUpdateRequest): Promise<any> => {
    try {
        await api.post("/manager/menus/update", menuUpdateData);
    } catch (error) {
        console.error("메뉴 수정 실패");
        throw error;
    }
}

export const getMenuList = async (): Promise<MenuList[]> => {
    try {
        const response = await api.get<MenuList[]>("/manager/menus/all");
        return response.data;
    } catch (error) {
        console.error("메뉴 목록을 불러오지 못함 ", error);
        throw error;
    }
}

export const updateMenuOrder = (orderList: { menuNo: number; menuOrder: number }[]) => {
    return api.put("/manager/menus/order", orderList);
};