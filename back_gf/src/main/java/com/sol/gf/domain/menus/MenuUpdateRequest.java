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
public class MenuUpdateRequest {
    private Long menuNo;
    private String menuName;
    private String menuUrl;
    private Long categoryNo;
    private List<Long> roleNos;
    private List<MenuPermissionRequest> permissions;
}
