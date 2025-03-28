package com.sol.gf.domain.admin;

import org.springframework.stereotype.Service;

@Service
public class AdminService {

    // 사용자 리스트 검색(이름, 아이디, 권한) - 관리자는 전체 조회 가능, 매니저는 ROLE_USER 와 ROLE_VISITOR 만 조회 가능
    // 사용자 권한 변경 - 관리자는 전체 변경 가능, 매니저는 ROLE_USER 와 ROLE_VISITOR 만 변경 가능
    // 사용자 삭제(탈퇴)

}
