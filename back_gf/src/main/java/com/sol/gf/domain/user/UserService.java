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

        RolesEntity defaultRole = rolesRepository.findByRolesNo(4).orElse(null);

        UserEntity newUser = UserEntity.builder()
                .userId(userDto.getUserId())
                .userName(userDto.getUserName())
                .userPassword(passwordEncoder.encode(userDto.getRawPassword()))
                .userEmail(userDto.getUserEmail())
                .userCreateTime(LocalDateTime.now())
                .userRoles(defaultRole)
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
