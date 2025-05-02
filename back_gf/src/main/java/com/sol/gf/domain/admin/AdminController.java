package com.sol.gf.domain.admin;


import com.sol.gf.domain.menus.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class AdminController {

    private final AdminService adminService;
    private final MenusService menusService;

    // 권한 가져오기 - 관리자는 전체, 매니저는 관리자 제외
    @GetMapping("/manager/roles")
    public ResponseEntity<List<AdminRoleListDto>> getRoleList() {
        List<AdminRoleListDto> roles = adminService.getRoleList();
        return ResponseEntity.ok(roles);
    }

    // 권한 수정
    @PutMapping("/manager/roles/update")
    public ResponseEntity<Void> updateRole(@RequestBody List<UserRoleUpdateDto> updates) {
        adminService.updateUserRole(updates);
        return ResponseEntity.ok().build();
    }

    // 메뉴 생성
    @PostMapping("/admin/menus/create")
    public ResponseEntity<?> createMenus(@RequestBody MenuCreateRequest menuCreateRequest) {
        try {
            MenuCreateRequest createMenus = menusService.createMenu(menuCreateRequest);
            if (createMenus == null) {
                return null;
            }
            return ResponseEntity.status(HttpStatus.CREATED).body(createMenus);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // 메뉴 수정
    @PostMapping("/manager/menus/update")
    public ResponseEntity<?> updateMenus(@RequestBody MenuUpdateRequest menuUpdateRequest) {
        try {
            Long menuNo = menuUpdateRequest.getMenuNo();
            MenusEntity updateMenus = menusService.updateMenu(menuNo, menuUpdateRequest);
            if (updateMenus == null) {
                return null;
            }
            return ResponseEntity.status(HttpStatus.CREATED).body(updateMenus);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // 전체 메뉴 목록 가져오기
    @GetMapping("/manager/menus/all")
    public ResponseEntity<List<MenuListDto>> findAll() {
        List<MenuListDto> menuList = menusService.getAllMenus();
        return ResponseEntity.ok(menuList);
    }

    // 메뉴 순서 변경하기
    @PutMapping("/manager/menus/order")
    public void updateMenuOrder(@RequestBody List<MenusOrderDto> orderList) {
        menusService.updateMenuOrder(orderList);
    }

}
