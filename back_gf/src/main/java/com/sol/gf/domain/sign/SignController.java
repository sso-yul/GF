package com.sol.gf.domain.sign;

import com.sol.gf.domain.user.UserEntity;
import com.sol.gf.domain.user.UserRepository;
import com.sol.gf.security.jwt.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class SignController {

    private final SignService signService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @PostMapping("/api/sign/signin")
    public ResponseEntity<SignResponse> signin(@RequestBody SignRequest signRequest) {
        SignResponse signResponse = signService.signin(signRequest.getUserId(), signRequest.getRawPassword());
        return ResponseEntity.ok(signResponse);
    }

    @PostMapping("/api/sign/signout")
    public ResponseEntity<?> signout(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        String userId = jwtUtil.getUserIdFromJwt(token);
        UserEntity user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        signService.signout(user);

        return ResponseEntity.ok().body(Map.of("message", "로그아웃 성공"));
    }
}
