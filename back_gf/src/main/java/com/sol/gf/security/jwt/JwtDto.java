package com.sol.gf.security.jwt;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
@AllArgsConstructor
public class JwtDto {
    private String token;
    private String accessToken;
    private String refreshToken;
}
