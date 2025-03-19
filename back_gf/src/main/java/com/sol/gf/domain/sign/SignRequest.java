package com.sol.gf.domain.sign;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignRequest {
    private String userId;
    private String rawPassword;
    private String roles;
}
