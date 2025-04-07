import api from "./api";


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