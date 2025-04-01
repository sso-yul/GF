package com.sol.gf.domain.admin;

import com.sol.gf.domain.roles.RolesEntity;
import com.sol.gf.domain.roles.RolesRepository;
import com.sol.gf.security.AuthService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserDetailsService userDetailsService;
    private final AuthService authService;
    private final RolesRepository rolesRepository;

    public AdminService(UserDetailsService userDetailsService, AuthService authService, RolesRepository rolesRepository) {
        this.userDetailsService = userDetailsService;
        this.authService = authService;
        this.rolesRepository = rolesRepository;
    }

    // 사용자 리스트 검색(이름, 아이디, 권한) - 관리자는 전체 조회 가능, 매니저는 ROLE_USER 와 ROLE_VISITOR 만 조회 가능
    public boolean isAdmin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        String currentUserId = authentication.getName();
        UserDetails userDetails = userDetailsService.loadUserByUsername(currentUserId);

        return userDetails.getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_ADMIN"));
    }

    public boolean isManager() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        String currentUserId = authentication.getName();
        UserDetails userDetails = userDetailsService.loadUserByUsername(currentUserId);

        return userDetails.getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_MANAGER"));
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
    // 사용자 권한 변경 - 관리자는 전체 변경 가능, 매니저는 ROLE_USER 와 ROLE_VISITOR 만 변경 가능
    // 사용자 삭제(탈퇴)


}
