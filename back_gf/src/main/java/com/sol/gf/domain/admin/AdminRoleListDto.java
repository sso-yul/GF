package com.sol.gf.domain.admin;

import com.sol.gf.domain.roles.RolesEntity;
import com.sol.gf.domain.user.UserEntity;
import lombok.*;

@ToString
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AdminRoleListDto {
    private String roleName;
    private long roleNo;

    public static AdminRoleListDto adminRoleListDto(RolesEntity roles) {
        return new AdminRoleListDto(roles.getRoleName(), roles.getRoleNo());
    }

}
