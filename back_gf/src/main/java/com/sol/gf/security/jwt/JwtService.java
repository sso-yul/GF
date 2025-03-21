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

    // 리프레시 토큰 생성 및 저장
    public String createRefreshToken(UserEntity user) {
        refreshTokenRepository.deleteByUser(user);
        // 생성
        String refreshToken = jwtUtil.generateRefreshToken(user.getUserId(), user.getUserRoles().getRolesName());

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
        // 리프레시 토큰 유효성 검증
        String tokenUserId = jwtUtil.getUserIdFromJwt(refreshToken);

        if (tokenUserId == null || !tokenUserId.equals(userId)) {
            throw new IllegalStateException("리프레시 토큰이 유효하지 않습니다.");
        }

        RefreshTokenEntity refreshTokenEntity = refreshTokenRepository.findByRefreshToken(refreshToken)
                .orElseThrow(() -> new IllegalStateException("리프레시 토큰이 존재하지 않습니다."));

        if (refreshTokenEntity.getExpireTime().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("리프레시 토큰이 만료되었습니다.");
        }

        String roles = jwtUtil.getRolesFromJwt(refreshToken);

        // 새로운 액세스 토큰 생성
        return jwtUtil.generateToken(userId, roles);
    }

    // 토큰 만료 확인 및 새 액세스 토큰 발급 메서드 - 지금은 클라이언트에서 해결 중이니 굳이 필요 없음
    public String checkAndRefreshToken(String accessToken, String userId) {
        if (!jwtUtil.validateToken(accessToken)) {
            // 토큰이 유효하지 않으면 리프레시 토큰으로 새 액세스 토큰 발급
            RefreshTokenEntity refreshTokenEntity = refreshTokenRepository.findByUser_UserId(userId)
                    .orElseThrow(() -> new IllegalStateException("리프레시 토큰이 존재하지 않습니다."));

            return refreshAccessToken(refreshTokenEntity.getRefreshToken(), userId);
        }
        return accessToken; // 유효하면 기존 토큰 반환
    }

}
