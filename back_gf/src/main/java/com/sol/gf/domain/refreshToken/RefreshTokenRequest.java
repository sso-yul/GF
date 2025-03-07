package com.sol.gf.domain.refreshToken;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter
@AllArgsConstructor
public class RefreshTokenRequest {
    private String refreshToken;
    private String userId;
}
