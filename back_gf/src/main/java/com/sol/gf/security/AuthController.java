package com.sol.gf.security;

import com.sol.gf.domain.refreshToken.RefreshTokenRequest;
import com.sol.gf.global.dto.ErrorResponse;
import com.sol.gf.global.dto.TokenResponse;
import com.sol.gf.security.jwt.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    // 리프레시 토큰으로 액세서 토큰 재발급
    @PostMapping("/refresh")
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

    // db에서 역할 가져와 관리자인지 확안
    @GetMapping("/check-admin")
    public ResponseEntity<Boolean> checkAdmin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(false);
        }

        String currentUserId = authentication.getName();

        UserDetails userDetails = userDetailsService.loadUserByUsername(currentUserId);

        boolean isAdmin = userDetails.getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_ADMIN"));

        return ResponseEntity.ok(isAdmin);
    }

    // db에서 역할 가져와 매니저인지 확인
    @GetMapping("/check-manager")
    public ResponseEntity<Boolean> checkManager() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(false);
        }

        String currentUserId = authentication.getName();

        UserDetails userDetails = userDetailsService.loadUserByUsername(currentUserId);

        boolean isManager = userDetails.getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_MANAGER"));

        return ResponseEntity.ok(isManager);
    }

    // db에서 역할 가져와 관리자 또는 매니저인지 확인
    @GetMapping("/check-admin-or-manager")
    public ResponseEntity<Boolean> checkAdminOrManager() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(false);
        }

        String currentUserId = authentication.getName();

        UserDetails userDetails = userDetailsService.loadUserByUsername(currentUserId);

        boolean isAdminOrManager = userDetails.getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_MANAGER") || grantedAuthority.getAuthority().equals("ROLE_ADMIN"));

        return ResponseEntity.ok(isAdminOrManager);
    }
}
