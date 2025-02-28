package com.sol.gf.domain.authority;

import com.sol.gf.domain.user.UserEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "tb_authority")
public class AuthorityEntity {

    @Id
    private long authority_no;

    @Column(nullable = false)
    private String authority_name;

    @Setter
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "authority_id", referencedColumnName = "user_no")
    private UserEntity authority_id;

}
