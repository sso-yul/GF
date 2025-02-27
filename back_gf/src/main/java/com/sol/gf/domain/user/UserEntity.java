package com.sol.gf.domain.user;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Entity
@NoArgsConstructor
@Table(name = "tb_user")
public class UserEntity {

    @Id
    private long user_no;

    private String user_id;
    private String user_name;
    private String user_password;
    private LocalDateTime user_create_time;

    @OneToOne
    @JoinColumn(name = "user_img")
    private String user_img;
}
