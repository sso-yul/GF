package com.sol.gf.domain.user;

import com.sol.gf.domain.authority.AuthorityEntity;
import com.sol.gf.domain.img.ImgEntity;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@ToString
@Getter
@Entity
@NoArgsConstructor
@Table(name = "tb_user")
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long user_no;

    @Column(nullable = false)
    private String user_id;

    @Column(nullable = false)
    private String user_name;

    @Column(nullable = false)
    private String user_password;

    @Column(nullable = false)
    private LocalDateTime user_create_time;

    @OneToOne
    @JoinColumn(name = "user_img", referencedColumnName = "img_no")
    private ImgEntity user_img;

    @OneToMany(mappedBy = "user_no", fetch = FetchType.EAGER)
    private List<AuthorityEntity> roles = new ArrayList<>();

    public void setRoles(List<AuthorityEntity> role) {
        this.roles = role;
        role.forEach(o -> o.setAuthority_id(this));
    }
}
