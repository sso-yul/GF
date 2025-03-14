package com.sol.gf.security;

import com.sol.gf.domain.refreshToken.RefreshTokenRequest;
import com.sol.gf.global.dto.ErrorResponse;
import com.sol.gf.global.dto.TokenResponse;
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
    public ResponseEntity<?> refreshToken(@RequestBody RefreshTokenRequest request) {
        try {
            String newAccessToken = jwtService.refreshAccessToken(
                    request.getRefreshToken(),
                    request.getUserId()
            );
            return ResponseEntity.ok(new TokenResponse(newAccessToken));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("토큰 갱신 실패: " + e.getMessage()));
        }
    }
}
