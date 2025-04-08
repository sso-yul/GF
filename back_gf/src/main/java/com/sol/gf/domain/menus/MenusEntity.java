package com.sol.gf.domain.menus;

import com.sol.gf.domain.category.CategoryEntity;
import com.sol.gf.domain.roles.RolesEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name ="tb_menus")
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class MenusEntity {

    @Id
    @Column(name = "menu_no")
    private long menuNo;

    @Column(name = "menu_name")
    private String menuName;

    @Column(name = "menu_url")
    private String menuUrl;

    @ManyToOne
    @JoinColumn(name = "menu_category_no")
    private CategoryEntity menuCategoryNo;

    @ManyToMany
    @JoinTable(
            name = "tb_menu_roles",
            joinColumns = @JoinColumn(name = "menu_no"),
            inverseJoinColumns = @JoinColumn(name = "role_no")
    )
    private Set<RolesEntity> roles = new HashSet<>();

    // 수정 메서드
    public void updateMenu(Long menuNo, String menuName, String menuUrl, CategoryEntity categoryEntity) {
        this.menuNo = menuNo;
        this.menuName = menuName;
        this.menuUrl = menuUrl;
        this.menuCategoryNo = categoryEntity;
    }
    public void addRole(RolesEntity role) {
        this.roles.add(role);
    }
    public void removeRole(RolesEntity role) {
        this.roles.remove(role);
    }
}
