package com.sol.gf.domain.admin;


import com.sol.gf.domain.menus.MenuCreateRequest;
import com.sol.gf.domain.menus.MenusDto;
import com.sol.gf.domain.menus.MenusEntity;
import com.sol.gf.domain.menus.MenusService;
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

    // 역할 가져오기 - 관리자는 전체, 매니저는 관리자 제외
    @GetMapping("/manager/roles")
    public ResponseEntity<List<AdminRoleListDto>> getRoleList() {
        List<AdminRoleListDto> roles = adminService.getRoleList();
        return ResponseEntity.ok(roles);
    }

    @PutMapping("/manager/roles/update")
    public ResponseEntity<Void> updateRole(@RequestBody List<UserRoleUpdateDto> updates) {
        adminService.updateUserRole(updates);
        return ResponseEntity.ok().build();
    }

    // 메뉴 생성
    @PostMapping("/manager/menus/create")
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
}
