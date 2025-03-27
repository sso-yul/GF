package com.sol.gf.domain.user;

import com.sol.gf.domain.roles.RolesEntity;
import com.sol.gf.domain.roles.RolesRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserService {
    // 내 정보 수정,
    // 유저 리스트 불러오기 - 이름, 아이디, 역할 (관리자 페이지에서도 사용)
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RolesRepository rolesRepository;

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

        RolesEntity defaultRole = rolesRepository.findByroleNo(4).orElse(null);

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
}
