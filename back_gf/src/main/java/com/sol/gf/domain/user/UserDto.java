package com.sol.gf.domain.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class UserDto {
    private String userNo;
    private String userId;
    private String userEmail;
    private String userPassword;
    private String userName;
    private String userImg;
}
