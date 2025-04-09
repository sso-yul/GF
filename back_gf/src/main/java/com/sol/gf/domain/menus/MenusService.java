package com.sol.gf.domain.menus;

import com.sol.gf.domain.category.CategoryEntity;
import com.sol.gf.domain.category.CategoryRepository;
import com.sol.gf.domain.permission.*;
import com.sol.gf.domain.roles.RolesEntity;
import com.sol.gf.domain.roles.RolesRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class MenusService {

    public static class PermissionNames {
        public static final String READ = "READ";
        public static final String WRITE = "WRITE";
    }

    private final MenusRepository menusRepository;
    private final MenuPermissionsRepository menuPermissionsRepository;
    private final RolesRepository rolesRepository;
    private final CategoryRepository categoryRepository;
    private final PermissionTypesRepository permissionTypesRepository;

    public MenusService(MenusRepository menusRepository, MenuPermissionsRepository menuPermissionsRepository, RolesRepository rolesRepository, CategoryRepository categoryRepository, PermissionTypesRepository permissionTypesRepository) {
        this.menusRepository = menusRepository;
        this.menuPermissionsRepository = menuPermissionsRepository;
        this.rolesRepository = rolesRepository;
        this.categoryRepository = categoryRepository;
        this.permissionTypesRepository = permissionTypesRepository;
    }

    // 게시판 리스트 네비바에 뿌리기
    public List<MenusEntity> getAllMenus() {
        return menusRepository.findAll();
    }

    public List<MenusEntity> getMenusByCategory(long categoryNo) {
        CategoryEntity category = categoryRepository.findById(categoryNo)
                .orElseThrow(() -> new EntityNotFoundException("카테고리를 찾을 수 없습니다."));
        return menusRepository.findByMenuCategoryNo(category);
    }

    public List<MenusEntity> getAccessibleMenus(List<String> userRoles) {
        List<MenusEntity> allMenus = menusRepository.findAll();
        return allMenus.stream()
                .filter(menu -> hasReadPermission(menu, userRoles))
                .collect(Collectors.toList());
    }


    // 게시판 생성 가능(기존 1,2,3,4,5 템플릿(카테고리) 바탕으로 / 사용자 권한도 동시에 부여)
    @Transactional
    public MenuCreateRequest createMenu(MenuCreateRequest request) {
        CategoryEntity category = categoryRepository.findById(request.getCategoryNo())
                .orElseThrow(() -> new IllegalArgumentException("카테고리를 찾을 수 없습니다."));

        MenusEntity menu = MenusEntity.builder()
                .menuOrder(request.getMenuOrder())
                .menuName(request.getMenuName())
                .menuUrl(request.getMenuUrl())
                .menuCategoryNo(category)
                .roles(new HashSet<>())
                .build();

        if (request.getRoleNos() != null) {
            for (Long roleNo : request.getRoleNos()) {
                RolesEntity roles = rolesRepository.findById(roleNo)
                        .orElseThrow(() -> new EntityNotFoundException("권한을 찾을 수 없습니다."));
                menu.addRole(roles);
            }
        }

        MenusEntity savedMenus = menusRepository.save(menu);

        if (request.getPermissions() != null) {
            for (MenuPermissionRequest perm : request.getPermissions()) {
                RolesEntity role = rolesRepository.findById(perm.getRoleNo())
                        .orElseThrow(() -> new EntityNotFoundException("권한을 찾을 수 없습니다."));

                PermissionTypesEntity permission = permissionTypesRepository.findByPermissionName(perm.getPermissionType())
                        .orElseThrow(() -> new EntityNotFoundException("권한 타입을 찾을 수 없습니다."));

                MenuPermissionsEntity menuPermission = MenuPermissionsEntity.builder()
                        .menuNo(savedMenus)
                        .roleNo(role)
                        .permissionTypeNo(permission)
                        .build();

                menuPermissionsRepository.save(menuPermission);
            }
        }

        List<MenuPermissionRequest> permissionRequests = new ArrayList<>();
        for (MenuPermissionsEntity perm : menuPermissionsRepository.findByMenuNo(savedMenus)) {
            permissionRequests.add(
                    MenuPermissionRequest.builder()
                            .roleNo(perm. getRoleNo().getRoleNo())
                            .permissionType(perm.getPermissionTypeNo().getPermissionName())
                            .build()
            );
        }

        return MenuCreateRequest.builder()
                .menuOrder(savedMenus.getMenuOrder())
                .menuName(savedMenus.getMenuName())
                .menuUrl(savedMenus.getMenuUrl())
                .categoryNo(savedMenus.getMenuCategoryNo().getCategoryNo())
                .permissions(permissionRequests)
                .build();
    }

    // 메뉴 수정
    @Transactional
    public MenusEntity updateMenu(Long menuNo, MenuUpdateRequest request) {
        MenusEntity menu = menusRepository.findById(menuNo)
                .orElseThrow(() -> new EntityNotFoundException("메뉴를 찾을 수 없습니다."));
        CategoryEntity category = null;
        if (request.getCategoryNo() != null) {
            category = categoryRepository.findById(request.getCategoryNo())
                    .orElseThrow(() -> new EntityNotFoundException("카테고리를 찾을 수 없습니다."));
        }
        menu.updateMenu(
                request.getMenuOrder(),
                request.getMenuName(),
                request.getMenuUrl(),
                category != null ? category : menu.getMenuCategoryNo()
        );

        if (request.getRoleNos() != null) {
            Set<RolesEntity> currentRoles = new HashSet<>(menu.getRoles());
            for (RolesEntity role : currentRoles) {
                menu.removeRole(role);
            }

            for (Long roleNo : request.getRoleNos()) {
                RolesEntity role = rolesRepository.findById(roleNo)
                        .orElseThrow(() -> new EntityNotFoundException("권한을 찾을 수 없습니다."));
                menu.addRole(role);
            }
        }
        return menu;
    }


    public boolean hasReadPermission(MenusEntity menu, List<String> userRoles) {
        return checkPermission(menu, userRoles, PermissionNames.READ);
    }

    public boolean hasWritePermission(MenusEntity menu, List<String> userRoles) {
        return checkPermission(menu, userRoles, PermissionNames.WRITE);
    }

    private boolean checkPermission(MenusEntity menu, List<String> userRoles, String permissionName) {
        Optional<PermissionTypesEntity> permissionOpt = permissionTypesRepository.findByPermissionName(permissionName);
        if (permissionOpt.isEmpty()) {
            return false;
        }

        PermissionTypesEntity permissionType = permissionOpt.get();

        return menuPermissionsRepository.existsByMenuNoAndRoleNoRoleNameInAndPermissionTypeNo(
                menu, userRoles, permissionType
        );
    }


    // 게시판 삭제 가능 - 게시판 삭제 시 하위 게시글 전부 삭제되도록
}
