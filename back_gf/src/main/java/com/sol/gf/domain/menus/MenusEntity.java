package com.sol.gf.domain.menus;

import com.sol.gf.domain.category.CategoryEntity;
import com.sol.gf.domain.permission.MenuPermissionsEntity;
import com.sol.gf.domain.roles.RolesEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name ="tb_menus")
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class MenusEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "menu_no")
    private long menuNo;

    @Column(name = "menu_order", nullable = false)
    private long menuOrder;

    @Column(name = "menu_name", nullable = false)
    private String menuName;

    @Column(name = "menu_url", nullable = false)
    private String menuUrl;

    @ManyToOne
    @JoinColumn(name = "menu_category_no", referencedColumnName = "category_no", nullable = false)
    private CategoryEntity menuCategoryNo;

    @ManyToMany
    @JoinTable(
            name = "tb_menu_roles",
            joinColumns = @JoinColumn(name = "menu_no"),
            inverseJoinColumns = @JoinColumn(name = "role_no")
    )
    private Set<RolesEntity> roles = new HashSet<>();

    @OneToMany(mappedBy = "menuNo")
    private List<MenuPermissionsEntity> permissions = new ArrayList<>();

    // 수정 메서드
    public void updateMenu(Long menuOrder, String menuName, String menuUrl, CategoryEntity categoryEntity) {
        this.menuOrder = menuOrder;
        this.menuName = menuName;
        this.menuUrl = menuUrl;
        this.menuCategoryNo = categoryEntity;
    }
    public void addRole(RolesEntity role) {
        this.roles.add(role);
    }

    public void updateMenuOrder(Long menuOrder) {
        this.menuOrder = menuOrder;
    }
}
