package com.sol.gf.domain.user;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Builder
public class UserDto {
    private String userNo;
    private String userId;
    private String userName;
    private String userImg;

    public UserDto(String userNo, String userId, String userName, String userImg) {
        this.userNo = userNo;
        this.userId = userId;
        this.userName = userName;
        this.userImg = userImg;
    }


}
