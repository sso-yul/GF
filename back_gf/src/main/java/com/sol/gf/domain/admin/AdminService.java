package com.sol.gf.domain.admin;

import com.sol.gf.domain.roles.RolesEntity;
import com.sol.gf.domain.roles.RolesRepository;
import com.sol.gf.domain.user.UserEntity;
import com.sol.gf.domain.user.UserRepository;
import com.sol.gf.security.AuthService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final AuthService authService;
    private final RolesRepository rolesRepository;
    private final UserRepository userRepository;

    // 사용자 역할 불러오기 - 관리자는 전체, 매니저는 관리자와 매니저 제외 호출
    public List<AdminRoleListDto> getRoleList() {
        List<RolesEntity> roles;

        if (authService.isAdmin()) {
            roles = rolesRepository.findAll();
        } else if (authService.isManager()) {
            List<Long> roleNo = Arrays.asList(1L, 2L);
            roles = rolesRepository.findByRoleNoNotIn(roleNo);
        } else {
            throw new IllegalStateException("접근 권한이 없습니다.");
        }
        return roles.stream().map(AdminRoleListDto::adminRoleListDto).collect(Collectors.toList());
    }

    // 사용자 권한 변경
    @Transactional
    public void updateUserRole(List<UserRoleUpdateDto> updates) {
        for (UserRoleUpdateDto update : updates) {
            UserEntity user = userRepository.findByUserId(update.getUserId())
                    .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없음, " + update.getUserId()));
            RolesEntity role = rolesRepository.findById(update.getRoleNo())
                    .orElseThrow(() -> new EntityNotFoundException("역할을 찾을 수 없음, " + update.getRoleNo()));

            user.setUserRole(role);
            userRepository.save(user);
        }
    }

    // 사용자 삭제(탈퇴)
    //


}
