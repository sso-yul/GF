package com.sol.gf.domain.permission;

import com.sol.gf.domain.menus.MenusEntity;
import com.sol.gf.domain.roles.RolesEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Table(name = "tb_menu_permissions")
public class MenuPermissionsEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long permissionId;

    @ManyToOne
    @JoinColumn(name = "per_menu_no", nullable = false)
    private MenusEntity menuNo;

    @ManyToOne
    @JoinColumn(name = "per_role_no", nullable = false)
    private RolesEntity roleNo;

    @ManyToOne
    @JoinColumn(name = "per_permission_type_no", nullable = false)
    private PermissionTypesEntity permissionTypeNo;

}

