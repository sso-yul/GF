package com.sol.gf.domain.permission;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MenuPermissionRequest {
    private long menuNo;
    private long roleNo;
    private String permissionType;
    private boolean isAnonymous;
}
