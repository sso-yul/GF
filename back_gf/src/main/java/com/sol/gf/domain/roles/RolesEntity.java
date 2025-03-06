package com.sol.gf.domain.roles;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "tb_roles")
public class RolesEntity {

    @Id
    @Column(name = "roles_no")
    private long rolesNo;

    @Column(nullable = false)
    private String rolesName;

}
