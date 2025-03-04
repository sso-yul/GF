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


    // 회원가입
    @Transactional
    public UserDto createUser(UserDto userDto, String rawPassword) {
        userRepository.findByUserId(userDto.getUserId())
                .ifPresent(user -> {
                    throw new IllegalStateException("이미 사용 중인 아이디입니다.");
                });

        userRepository.findByUserEmail(userDto.getUserEmail())
                .ifPresent(user -> {
                    throw new IllegalStateException("이미 사용 중인 이메일입니다.");
                });

        RolesEntity userRole = rolesRepository.findByRolesNo(3)
                .orElseThrow(() -> new IllegalStateException("해당 역할을 찾을 수 없습니다."));

        UserEntity newUser = UserEntity.builder()
                .userId(userDto.getUserId())
                .userName(userDto.getUserName())
                .userPassword(passwordEncoder.encode(rawPassword))
                .userEmail(userDto.getUserEmail())
                .userCreateTime(LocalDateTime.now())
                .userRoles((int) userRole.getRolesNo())
                .userImg(null)
                .build();

        UserEntity savedUser = userRepository.save(newUser);

        return new UserDto(
                String.valueOf(savedUser.getUser_no()),
                savedUser.getUserId(),
                savedUser.getUserEmail(),
                null,
                savedUser.getUserName(),
                null
        );
    }
}
