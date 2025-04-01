package com.sol.gf.domain.admin;

import com.sol.gf.domain.user.UserEntity;
import lombok.*;

@ToString
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AdminUserListDto {
    private String userId;
    private String userName;
    private String roleName;

    public static AdminUserListDto adminUserListDto(UserEntity user) {
        return new AdminUserListDto(
                user.getUserId(),
                user.getUserName(),
                user.getUserRole().getRoleName()
        );
    }

}
