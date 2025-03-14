package com.sol.gf.domain.refreshToken;

import lombok.*;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Data
public class RefreshTokenRequest {
    private String refreshToken;
    private String userId;
}
