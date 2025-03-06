package com.sol.gf.domain.user;

import com.sol.gf.domain.img.ImgEntity;
import com.sol.gf.domain.roles.RolesEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@ToString
@Getter
@Entity
@NoArgsConstructor
@Table(name = "tb_user")
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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

    @ManyToOne
    @JoinColumn(name = "user_roles", referencedColumnName = "roles_no")
    private RolesEntity userRoles;

    @OneToOne
    @JoinColumn(name = "user_img", referencedColumnName = "img_no")
    private ImgEntity userImg;

    @Builder
    public UserEntity(String userId, String userName, String userPassword, String userEmail,
                      LocalDateTime userCreateTime, RolesEntity userRoles, ImgEntity userImg) {
        this.userId = userId;
        this.userName = userName;
        this.userPassword = userPassword;
        this.userEmail = userEmail;
        this.userCreateTime = userCreateTime;
        this.userRoles = userRoles;
        this.userImg = userImg;
    }
}
