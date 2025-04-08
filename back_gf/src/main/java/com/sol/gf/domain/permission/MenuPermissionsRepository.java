package com.sol.gf.domain.permission;

import com.sol.gf.domain.menus.MenusEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuPermissionsRepository extends JpaRepository<MenuPermissionsEntity, Long> {
    List<MenuPermissionsEntity> findByMenuNo(MenusEntity menuNo);
    boolean existsByMenuNoAndRoleNoRoleNameInAndPermissionTypeNo(
            MenusEntity menuNo,
            List<String> roleNames,
            PermissionTypesEntity permissionTypeNo
    );
}
