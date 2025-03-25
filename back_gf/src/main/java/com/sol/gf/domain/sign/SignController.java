package com.sol.gf.domain.sign;

import com.sol.gf.domain.user.UserEntity;
import com.sol.gf.domain.user.UserRepository;
import com.sol.gf.security.jwt.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/sign")
public class SignController {

    private final SignService signService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @PostMapping("/signin")
    public ResponseEntity<SignResponse> signin(@RequestBody SignRequest signRequest) {
        SignResponse signResponse = signService.signin(signRequest.getUserId(), signRequest.getRawPassword());

        // 사용자 정보 저장
        Collection<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(signResponse.getRoles()));

        Authentication authentication = new UsernamePasswordAuthenticationToken(
                signResponse.getUserId(),  // 사용자 ID
                signRequest.getRawPassword(),  // 비밀번호
                authorities  // 사용자 역할
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        return ResponseEntity.ok(signResponse);
    }

    @PostMapping("/signout")
    public ResponseEntity<?> signout(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        String userId = jwtUtil.getUserIdFromJwt(token);
        UserEntity user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        signService.signout(user);

        return ResponseEntity.ok().body(Map.of("message", "로그아웃 성공"));
    }
}
