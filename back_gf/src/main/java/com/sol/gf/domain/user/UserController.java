package com.sol.gf.domain.user;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
public class UserController {
    private final UserService userService;


    // 회원 가입
    @PostMapping("/register")
    public ResponseEntity<?> signup(@RequestBody UserDto userDto) {
        try {
            UserDto createdUser = userService.createUser(userDto);
            if (createdUser == null) {
                return null;
            }
            return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // 회원 정보 수정 (이름, 비밀번호, 이메일, 프로필 사진)
    //
}
