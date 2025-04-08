package com.sol.gf.domain.category;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;

@Getter
@Entity
@Table(name = "tb_category")
public class CategoryEntity {

    @Id
    @Column(name = "category_no")
    private long categoryNo;

    @Column(name = "category_name")
    private String categoryName;
}
