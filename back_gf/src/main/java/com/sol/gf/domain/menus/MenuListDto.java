package com.sol.gf.domain.menus;

import com.sol.gf.domain.permission.MenuPermissionRequest;
import com.sol.gf.domain.roles.RolesDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MenuListDto {
    private long menuNo;
    private String menuName;
    private String menuUrl;
    private long menuOrder;

    private long categoryNo;
    private String categoryName;

    private List<RolesDto> roles;
    private List<MenuPermissionRequest> permissions;


    public static MenuListDto fromEntity(MenusEntity menusEntity) {
        return MenuListDto.builder()
                .menuNo(menusEntity.getMenuNo())
                .menuName(menusEntity.getMenuName())
                .menuUrl(menusEntity.getMenuUrl())
                .menuOrder(menusEntity.getMenuOrder())
                .categoryNo(menusEntity.getMenuCategoryNo().getCategoryNo())
                .categoryName(menusEntity.getMenuCategoryNo().getCategoryName())
                .roles(menusEntity.getRoles().stream()
                        .map(role -> RolesDto.builder()
                                .roleNo(role.getRoleNo())
                                .roleName(role.getRoleName())
                                .build())
                        .toList())
                .permissions(menusEntity.getPermissions().stream()
                        .map(p -> new MenuPermissionRequest(
                                p.getRoleNo().getRoleNo(),
                                p.getPermissionTypeNo().getPermissionName())
                        ).
                        toList())
                .build();
    }
}
