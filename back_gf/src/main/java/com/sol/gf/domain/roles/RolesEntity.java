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
    @Column(name = "role_no")
    private long roleNo;

    @Column(nullable = false)
    private String roleName;

}
