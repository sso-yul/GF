package com.sol.gf.domain.permission;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;

@Getter
@Entity
@Table(name = "tb_permission_types")
public class PermissionTypesEntity {

    @Id
    @Column(name = "permission_type_no")
    private long permissionTypeNo;

    @Column(name = "permission_name")
    private String permissionName;
}
