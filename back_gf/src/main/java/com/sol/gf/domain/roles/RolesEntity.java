package com.sol.gf.domain.roles;

import com.sol.gf.domain.user.UserEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "tb_roles")
public class RolesEntity {

    @Id
    private long rolesNo;

    @Column(nullable = false)
    private String rolesName;
}
