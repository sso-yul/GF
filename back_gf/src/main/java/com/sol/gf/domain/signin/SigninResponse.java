package com.sol.gf.domain.signin;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SigninResponse {
    private String token;
    private String userId;
    private String userName;
    private String roles;
    private String refreshToken;
}