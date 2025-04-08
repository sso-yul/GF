package com.sol.gf.domain.menus;

import com.sol.gf.domain.permission.MenuPermissionRequest;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MenuCreateRequest {

    private String menuName;
    private String menuUrl;
    private long categoryNo;
    private long menuNo;

    private List<Long> roleNos;
    private List<MenuPermissionRequest> permissions;
}
