export const convertRoleNameToRoleNo = (roleName: string): number => {
    switch (roleName) {
        case "ROLE_ADMIN": return 1;
        case "ROLE_MANAGER": return 2;
        case "ROLE_USER": return 3;
        case "ROLE_VISITOR": return 4;
        case "ROLE_VIEWER": return 5;
        default: return 0;
    }
};