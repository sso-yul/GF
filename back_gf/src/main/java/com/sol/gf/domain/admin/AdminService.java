package com.sol.gf.domain.admin;

import com.sol.gf.domain.roles.RolesEntity;
import com.sol.gf.domain.roles.RolesRepository;
import com.sol.gf.security.AuthService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final AuthService authService;
    private final RolesRepository rolesRepository;

    public AdminService(AuthService authService, RolesRepository rolesRepository) {
        this.authService = authService;
        this.rolesRepository = rolesRepository;
    }

    // 사용자 역할 불러오기 - 관리자는 전체, 매니저는 관리자를 제외한 나머지
    public List<AdminRoleListDto> getRoleList() {
        List<RolesEntity> roles;

        if (authService.isAdmin()) {
            roles = rolesRepository.findAll();
        } else if (authService.isManager()) {
            roles = rolesRepository.findByRoleNoNot(1);
        } else {
            throw new IllegalStateException("접근 권한이 없습니다.");
        }
        return roles.stream().map(AdminRoleListDto::adminRoleListDto).collect(Collectors.toList());
    }
    // 사용자 권한 변경
    // 사용자 삭제(탈퇴)
    //


}
