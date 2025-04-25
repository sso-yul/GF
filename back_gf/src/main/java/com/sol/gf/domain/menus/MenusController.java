package com.sol.gf.domain.menus;

import com.sol.gf.domain.permission.MenuPermissionRequest;
import com.sol.gf.domain.roles.RolesEntity;
import com.sol.gf.domain.roles.RolesRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
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
        List<String> userRoles;
        if (authentication == null || authentication instanceof AnonymousAuthenticationToken) {
            userRoles = Collections.singletonList("ROLE_VIEWER");
        } else {
            userRoles = authentication.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .toList();
        }

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
//    @PostMapping("/permission-check")
//    public ResponseEntity<Map<String, Object>> checkPermission(@RequestBody MenuPermissionRequest request) {
//        long roleNo = request.getRoleNo();
//
//        RolesEntity role;
//        try {
//            role = rolesRepository.findById(request.getRoleNo())
//                    .orElseThrow(() -> new RuntimeException("역할을 찾을 수 없습니다: " + request.getRoleNo()));
//        } catch (Exception e) {
//            role = rolesRepository.findByRoleName("ROLE_VIEWER")
//                    .orElseThrow(() -> new RuntimeException("ROLE_VIEWER 역할을 찾을 수 없습니다"));
//            roleNo = role.getRoleNo();
//        }
//        boolean hasPermission = menusService.hasPermission(
//                request.getMenuNo(),
//                request.getPermissionType(),
//                roleNo
//        );
//
//        MenusEntity menu = menusService.findByMenuNo(request.getMenuNo());
//        List<String> userRoles = Collections.singletonList(role.getRoleName());
//        MenusDto menuDto = convertToDTO(Collections.singletonList(menu), userRoles).get(0);
//
//        Map<String, Object> response = new HashMap<>();
//        response.put("hasPermission", hasPermission);
//        response.put("menu", menuDto);
//
//        return ResponseEntity.ok(response);
//    }
    @PostMapping("/permission-check")
    public ResponseEntity<Map<String, Object>> checkPermission(
            @RequestBody MenuPermissionRequest request,
            HttpServletRequest httpRequest
    ) {
        String roleName;
        boolean isAnonymous = request.isAnonymous();

        if (isAnonymous) {
            roleName = "ROLE_VIEWER";
        } else {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpServletResponse.SC_UNAUTHORIZED)
                        .body(Map.of("hasPermission", false, "message", "인증 정보 없음"));
            }

            roleName = authentication.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .findFirst()
                    .orElse("ROLE_VIEWER"); // 인증은 되었지만 권한 없음 시 fallback
        }

        // 역할 이름 → roleNo
        RolesEntity role = rolesRepository.findByRoleName(roleName)
                .orElseThrow(() -> new RuntimeException("해당 역할을 찾을 수 없습니다: " + roleName));

        boolean hasPermission = menusService.hasPermission(
                request.getMenuNo(),
                request.getPermissionType(),
                role.getRoleNo()
        );

        MenusEntity menu = menusService.findByMenuNo(request.getMenuNo());
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
}
