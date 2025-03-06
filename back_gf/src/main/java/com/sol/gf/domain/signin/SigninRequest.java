package com.sol.gf.domain.signin;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SigninRequest {
    private String userId;
    private String rawPassword;
}
