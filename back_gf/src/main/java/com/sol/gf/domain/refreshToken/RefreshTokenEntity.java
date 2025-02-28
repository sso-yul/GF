package com.sol.gf.domain.refreshToken;

import com.sol.gf.domain.user.UserEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Entity
@NoArgsConstructor
@Table(name = "tb_refresh_token")
public class RefreshTokenEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long token_id;

    @Column(nullable = false)
    private String refresh_token;

    @Column(nullable = false)
    private LocalDateTime expire_time;

    private LocalDateTime create_at;

    @OneToOne
    @JoinColumn(name = "user_no", referencedColumnName = "user_no")
    private UserEntity user;


}
