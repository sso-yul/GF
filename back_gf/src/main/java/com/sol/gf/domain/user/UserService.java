package com.sol.gf.domain.user;

import com.sol.gf.domain.admin.AdminUserListDto;
import com.sol.gf.domain.roles.RolesEntity;
import com.sol.gf.domain.roles.RolesRepository;
import com.sol.gf.security.AuthService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    // 내 정보 수정 - 내 정보 불러오기
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RolesRepository rolesRepository;
    private final AuthService authService;

    // 회원 가입
    @Transactional
    public UserDto createUser(UserDto userDto) {
        userRepository.findByUserId(userDto.getUserId())
                .ifPresent(user -> {
                    throw new IllegalStateException("이미 사용 중인 아이디입니다.");
                });

        userRepository.findByUserEmail(userDto.getUserEmail())
                .ifPresent(user -> {
                    throw new IllegalStateException("이미 사용 중인 이메일입니다.");
                });

        userRepository.findByUserName(userDto.getUserName())
                .ifPresent(user -> {
                    throw new IllegalStateException("이미 사용 중인 이름입니다.");
                });

        RolesEntity defaultRole = rolesRepository.findByRoleNo(4).orElse(null);

        UserEntity newUser = UserEntity.builder()
                .userId(userDto.getUserId())
                .userName(userDto.getUserName())
                .userPassword(passwordEncoder.encode(userDto.getRawPassword()))
                .userEmail(userDto.getUserEmail())
                .userCreateTime(LocalDateTime.now())
                .userRole(defaultRole)
                .userImg(null)
                .build();

        UserEntity savedUser = userRepository.save(newUser);

        return UserDto.builder()
                .userNo(String.valueOf(savedUser.getUserNo()))
                .userId(savedUser.getUserId())
                .userEmail(savedUser.getUserEmail())
                .userName(savedUser.getUserName())
                .userImg(null)
                .rawPassword(null)
                .build();
    }

    // 사용자 목록 조회
    public List<AdminUserListDto> getUserList() {
        List<UserEntity> users;

        if (authService.isAdmin()) {
            users = userRepository.findAll();
        } else if (authService.isManager()) {
            users = userRepository.findByUserRoleNot(rolesRepository.findByRoleNo(1).orElseThrow());
        } else {
            users = userRepository.findByUserRoleNotIn(
                    List.of(
                            rolesRepository.findByRoleNo(1).orElseThrow(),
                            rolesRepository.findByRoleNo(2).orElseThrow()
                    )
            );
        }
        return users.stream().map(AdminUserListDto::adminUserListDto).collect(Collectors.toList());
    }
}
