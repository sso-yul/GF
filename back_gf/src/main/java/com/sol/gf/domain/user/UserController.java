package com.sol.gf.domain.user;

import com.sol.gf.domain.admin.AdminUserListDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
public class UserController {
    private final UserService userService;

    // 회원 정보 수정 (이름, 비밀번호, 이메일, 프로필 사진)

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

    // 사용자 목록 조회
    @GetMapping("/list")
    public ResponseEntity<List<AdminUserListDto>> getUserList() {
        List<AdminUserListDto> userList = userService.getUserList();
        return ResponseEntity.ok(userList);
    }
}
