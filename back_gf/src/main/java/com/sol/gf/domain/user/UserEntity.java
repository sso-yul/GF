package com.sol.gf.domain.user;

import com.sol.gf.domain.img.ImgEntity;
import com.sol.gf.domain.roles.RolesEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@NoArgsConstructor
@Table(name = "tb_user")
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_no")
    private long userNo;

    @Column(nullable = false)
    private String userId;

    @Column(nullable = false)
    private String userEmail;

    @Column(nullable = false)
    private String userName;

    @Column(nullable = false)
    private String userPassword;

    @Column(nullable = false)
    private LocalDateTime userCreateTime;

    @OneToOne
    @JoinColumn(name = "user_role", referencedColumnName = "role_no")
    private RolesEntity userRole;

    @OneToOne
    @JoinColumn(name = "user_img", referencedColumnName = "img_no")
    private ImgEntity userImg;

    @Builder
    public UserEntity(String userId, String userName, String userPassword, String userEmail,
                      LocalDateTime userCreateTime, RolesEntity userRole, ImgEntity userImg) {
        this.userId = userId;
        this.userName = userName;
        this.userPassword = userPassword;
        this.userEmail = userEmail;
        this.userCreateTime = userCreateTime;
        this.userRole = userRole;
        this.userImg = userImg;
    }
}
