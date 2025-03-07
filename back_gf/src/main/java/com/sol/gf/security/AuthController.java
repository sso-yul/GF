package com.sol.gf.security;

import com.sol.gf.domain.refreshToken.RefreshTokenRequest;
import com.sol.gf.security.jwt.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class AuthController {

    private final JwtService jwtService;

    @PostMapping("/api/auth/refresh")
    public ResponseEntity<String> refreshToken(@RequestBody RefreshTokenRequest refreshTokenRequest) {
        try {
            // 리프레시 토큰을 받아서 새로운 액세스 토큰을 생성
            String newAccessToken = jwtService.refreshAccessToken(refreshTokenRequest.getRefreshToken(), refreshTokenRequest.getUserId());
            return ResponseEntity.ok(newAccessToken); // 새로운 액세스 토큰 반환
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("리프레시 토큰이 만료되었습니다. 다시 로그인 해주세요.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("리프레시 토큰 갱신에 실패했습니다.");
        }
    }
}
