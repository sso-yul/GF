import { MenuList } from "../stores/types";
import api from "./api";

// 권한에 맞는 메뉴 목록만 내비게이터에 출력
export const getAccessibleMenus = async (): Promise<MenuList[]> => {
    try {
        const response = await api.get<MenuList[]>("/menus/list");
        return response.data;
    } catch (error) {
        console.log("메뉴 목록을 불러오지 못함");
        throw error;
    }
};