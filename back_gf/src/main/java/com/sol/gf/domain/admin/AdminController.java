package com.sol.gf.domain.admin;


import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class AdminController {

    private final AdminService adminService;

    // 역할 가져오기 - 관리자는 전체, 매니저는 관리자 제외
    @GetMapping("/manager/roles")
    public ResponseEntity<List<AdminRoleListDto>> getRoleList() {
        List<AdminRoleListDto> roles = adminService.getRoleList();
        return ResponseEntity.ok(roles);
    }
}
