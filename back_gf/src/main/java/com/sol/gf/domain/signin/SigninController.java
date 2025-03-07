package com.sol.gf.domain.signin;


import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class SigninController {

    private final SigninService signinService;

    @PostMapping("/api/sign/signin")
    public ResponseEntity<SigninResponse> signin(@RequestBody SigninRequest signinRequest) {
        SigninResponse signinResponse = signinService.signin(signinRequest.getUserId(), signinRequest.getRawPassword());
        return ResponseEntity.ok(signinResponse);
    }
}
