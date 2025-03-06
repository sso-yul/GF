package com.sol.gf.security.jwt;

import com.sol.gf.domain.user.UserEntity;
import com.sol.gf.domain.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
        UserEntity user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없음: " + userId));

        // 사용자의 역할에 따라 권한 부여
        String role = String.valueOf(user.getUserRoles());
        // 역할 앞에 "ROLE_" 접두사가 없으면 추가
        if (!role.startsWith("ROLE_")) {
            role = "ROLE_" + role;
        }

        return new User(
                user.getUserId(),
                user.getUserPassword(),
                Collections.singletonList(new SimpleGrantedAuthority(role))
        );
    }
}