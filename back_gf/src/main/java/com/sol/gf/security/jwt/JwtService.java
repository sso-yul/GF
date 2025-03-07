package com.sol.gf.security.jwt;

import com.sol.gf.domain.refreshToken.RefreshTokenEntity;
import com.sol.gf.domain.refreshToken.RefreshTokenRepository;
import com.sol.gf.domain.user.UserEntity;
import com.sol.gf.domain.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class JwtService {

    private final JwtUtil jwtUtil;
    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;

    // 리프레시 토큰 생성 및 저장
    public String createRefreshToken(UserEntity user) {
        refreshTokenRepository.deleteByUser(user);
        // 생성
        String refreshToken = jwtUtil.generateToken(user.getUserId(), user.getUserRoles().getRolesName());

        // 만료시간
        LocalDateTime expireTime = LocalDateTime.now().plusDays(7);

        // 리프레시 토큰 저장
        RefreshTokenEntity refreshTokenEntity = RefreshTokenEntity.builder()
                                                .refreshToken(refreshToken)
                                                .expireTime(expireTime)
                                                .createdAt(LocalDateTime.now())
                                                .user(user)
                                                .build();

        refreshTokenRepository.save(refreshTokenEntity);
        return refreshToken;
    }

    public String refreshAccessToken(String refreshToken, String userId) {
        String roles = jwtUtil.getRolesFromJwt(refreshToken);

        if (userId == null) {
            throw new IllegalStateException("리프레시 토큰이 유효하지 않습니다.");
        }

        RefreshTokenEntity refreshTokenEntity = refreshTokenRepository.findByRefreshToken(refreshToken)
                .orElseThrow(() -> new IllegalStateException("리프레시 토큰이 존재하지 않습니다."));

        if (refreshTokenEntity.getExpireTime().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("리프레시 토큰이 만료되었습니다.");
        }
        // 새로운 액세스 토큰 생성
        return jwtUtil.generateToken(userId, roles);
    }

}
