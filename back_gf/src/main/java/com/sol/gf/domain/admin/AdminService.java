package com.sol.gf.domain.admin;

import org.springframework.stereotype.Service;

@Service
public class AdminService {

    // 사용자 리스트 검색(이름, 아이디, 권한) - 관리자는 전체 조회 가능, 매니저는 ROLE_USER 와 ROLE_VISITOR 만 조회 가능
    // 사용자 권한 변경 - 관리자는 전체 변경 가능, 매니저는 ROLE_USER 와 ROLE_VISITOR 만 변경 가능
    // 사용자 삭제(탈퇴)
    // 게시판 생성 가능(기존 1,2,3,4,5 템플릿 바탕으로)
    // 게시판 삭제 가능 - 게시판 삭제 시 하위 게시글 전부 삭제되도록
    // 게시판 별 글쓰기 권한 - 게시판 별로 누가 글 쓸 수 있는지 수정..  가능하게. . . . . . . . . 할 거 개 많네

}
