package com.sol.gf.domain.menus;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/menus")
public class MenusController {
    private final MenusService menusService;

    @GetMapping
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

    private List<MenusDto> convertToDTO(List<MenusEntity> menus, List<String> userRoles) {
        return menus.stream()
                .map(menu -> MenusDto.builder()
                        .menuNo(menu.getMenuNo())
                        .menuName(menu.getMenuName())
                        .menuUrl(menu.getMenuUrl())
                        .categoryNo(menu.getMenuCategoryNo().getCategoryNo())
                        .canWrite(menusService.hasWritePermission(menu, userRoles))
                        .roles(userRoles)
                        .build())
                .collect(Collectors.toList());
    }
}
