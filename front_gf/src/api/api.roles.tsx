export const fetchUserRole = async (userId: string): Promise<string> => {
    const response = await fetch(`/api/roles/${userId}`);
    if (!response.ok) {
        throw new Error("역할 정보 조회 실패");
    }
    const data = await response.json();
    return data.roleName;
};