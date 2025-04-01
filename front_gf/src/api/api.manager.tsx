import api from "./api";


export const getRoles = async (): Promise<string[]> => {
    try {
      const response = await api.get<{roleName: string}[]>("/manager/roles");
      return response.data.map(role => role.roleName);
    } catch (error) {
      console.error("역할 목록을 불러오지 못함", error);
      throw error;
    }
  };