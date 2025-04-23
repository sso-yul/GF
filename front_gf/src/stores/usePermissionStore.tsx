import { create } from "zustand";
import api from "../api/api";

type PermissionState = {
    hasPermission: boolean | null;
    loading: boolean;
    checkPermission: (menuNo: number, permissionType: string, roleNo: number) => void;
};

export const usePermissionStore = create<PermissionState>((set) => ({
    hasPermission: null, // null로 초기화하여 아직 체크되지 않았음을 표시
    loading: false,      // 초기 상태는 로딩 중이 아님
    checkPermission: async (menuNo, permissionType, roleNo) => {
        set({ loading: true });

        try {
            const response = await api.post("/menus/permission-check", {
                menuNo,
                permissionType,
                roleNo,
            });

            if (response.data.hasPermission) {
                set({ hasPermission: true });
            } else {
                set({ hasPermission: false });
            }
        } catch (error) {
            console.error("권한 확인 실패:", error);
            set({ hasPermission: false });
        } finally {
            set({ loading: false });
        }
    },
}));