package com.sol.gf.domain.admin;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRoleUpdateDto {
    private String userId;
    private long roleNo;
}
