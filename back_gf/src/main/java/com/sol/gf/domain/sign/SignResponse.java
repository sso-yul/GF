package com.sol.gf.domain.sign;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SignResponse {
    private String token;
    private String userId;
    private String userName;
    private String roleName;
    private String refreshToken;
}