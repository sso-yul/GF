package com.sol.gf.domain.menus;

import com.sol.gf.domain.permission.MenuPermissionRequest;
import com.sol.gf.domain.roles.RolesEntity;
import com.sol.gf.domain.roles.RolesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/menus")
public class MenusController {
    private final MenusService menusService;
    private final RolesRepository rolesRepository;

    // 내비바에 뿌리는 용도
    @GetMapping("/list")
    public ResponseEntity<List<MenusDto>> getAccessibleMenus(Authentication authentication) {
        List<String> userRoles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();

        List<MenusEntity> menus = menusService.getAccessibleMenus(userRoles);
        List<MenusDto> menuDtos = convertToDTO(menus, userRoles);
        return ResponseEntity.ok(menuDtos);
    }

    @GetMapping("/category/{categoryNo}")
    public ResponseEntity<List<MenusDto>> getMenusCategory(Authentication authentication, @PathVariable long categoryNo) {
        List<String> userRoles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();
        List<MenusEntity> menus = menusService.getMenusByCategory(categoryNo);
        List<MenusDto> dtoList = convertToDTO(menus, userRoles);

        return ResponseEntity.ok(dtoList);
    }

    // 조회, 작성 권한 확인용
    @PostMapping("/permission-check")
    public ResponseEntity<Map<String, Object>> checkPermission(@RequestBody MenuPermissionRequest request) {
        boolean hasPermission = menusService.hasPermission(
                request.getMenuNo(),
                request.getPermissionType(),
                request.getRoleNo()
        );

        MenusEntity menu = menusService.findByMenuNo(request.getMenuNo());

        RolesEntity role = rolesRepository.findById(request.getRoleNo())
                .orElseThrow(() -> new RuntimeException("역할을 찾을 수 없습니다: " + request.getRoleNo()));

        List<String> userRoles = Collections.singletonList(role.getRoleName());

        MenusDto menuDto = convertToDTO(Collections.singletonList(menu), userRoles).get(0);

        Map<String, Object> response = new HashMap<>();
        response.put("hasPermission", hasPermission);
        response.put("menu", menuDto);

        return ResponseEntity.ok(response);
    }

    // 커스텀 메뉴 url로 메뉴 번호 확인
    @GetMapping("/menu-no")
    public ResponseEntity<Map<String, Object>> getMenuNoByMenuUrl(@RequestParam("customUrl") String menuUrl) {
        long menuNo = menusService.getMenuNoByMenuUrl(menuUrl);
        Map<String, Object> response = new HashMap<>();
        response.put("menuNo", menuNo);
        return ResponseEntity.ok(response);
    }

    private List<MenusDto> convertToDTO(List<MenusEntity> menus, List<String> userRoles) {
        return menus.stream()
                .map(menu -> MenusDto.builder()
                        .menuNo(menu.getMenuNo())
                        .menuOrder(menu.getMenuOrder())
                        .menuName(menu.getMenuName())
                        .menuUrl(menu.getMenuUrl())
                        .categoryNo(menu.getMenuCategoryNo().getCategoryNo())
                        .categoryName(convertCategoryName(menu.getMenuCategoryNo().getCategoryName()))
                        .canWrite(menusService.hasWritePermission(menu, userRoles))
                        .roles(userRoles)
                        .build())
                .collect(Collectors.toList());
    }

    private String convertCategoryName(String categoryName) {
        return switch (categoryName) {
            case "Basic" -> "basic";
            case "Character" -> "char";
            case "Chatter" -> "chat";
            case "Picture" -> "pic";
            case "Thread" -> "thread";
            default -> categoryName;
        };
    }

    private long convertRoleNameToRoleNo(String roleName) {
        return switch (roleName) {
            case "ROLE_ADMIN" -> 1L;
            case "ROLE_MANAGER" -> 2L;
            case "ROLE_USER" -> 3L;
            case "ROLE_VISITOR" -> 4L;
            default -> 0L;
        };
    }
}
