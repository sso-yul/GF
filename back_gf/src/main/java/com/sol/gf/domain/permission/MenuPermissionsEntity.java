package com.sol.gf.domain.permission;

import com.sol.gf.domain.menus.MenusEntity;
import com.sol.gf.domain.roles.RolesEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "tb_menu_permissions")
@IdClass(MenuPermissionsEntity.MenuPermissionId.class)
public class MenuPermissionsEntity {

    @Id
    @ManyToOne
    @JoinColumn(name = "per_menu_no")
    private MenusEntity menuNo;

    @Id
    @ManyToOne
    @JoinColumn(name = "per_role_no")
    private RolesEntity roleNo;

    @Id
    @ManyToOne
    @JoinColumn(name = "per_permission_type_no")
    private PermissionTypesEntity permissionTypeNo;

    public static class MenuPermissionId implements Serializable {
        private long menuNo;
        private long roleNo;
        private long permissionTypeNo;
    }

}
