package com.sol.gf.domain.sign;

import com.sol.gf.domain.refreshToken.RefreshTokenRepository;
import com.sol.gf.domain.user.UserEntity;
import com.sol.gf.domain.user.UserRepository;
import com.sol.gf.security.jwt.JwtService;
import com.sol.gf.security.jwt.JwtUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SignService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final JwtService jwtService;
    private final RefreshTokenRepository refreshTokenRepository;

    // 로그인
    @Transactional
    public SignResponse signin(String userId, String rawPassword) {
        // 사용자 아이디로 사용자 검샑
        UserEntity user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalStateException("사용자를 찾을 수 없음"));

        // 비밀번호 검증
        if (!passwordEncoder.matches(rawPassword, user.getUserPassword())) {
            throw new IllegalStateException("잘못된 비밀번호");
        }

        // 인증을 위한 Authentication 객체 생성
        Authentication authentication = new UsernamePasswordAuthenticationToken(userId, rawPassword);

        try {
            // 인증을 수행하고, 인증 정보 반환
            authenticationManager.authenticate(authentication);

            String roles = user.getUserRole().getRoleName();
            String token = jwtUtil.generateToken(userId, roles);
            String refreshToken = jwtService.createRefreshToken(user);

            return new SignResponse(token, userId, user.getUserName(), roles, refreshToken);
        } catch (AuthenticationException e) {
            throw new IllegalStateException("로그인 인증 실패: " + e.getMessage());
        }
    }

    // 로그아웃
    @Transactional
    public void signout(UserEntity user) {
        refreshTokenRepository.deleteByUser(user);
    }
}
