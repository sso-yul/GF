package com.sol.gf.domain.menus;

import com.sol.gf.domain.category.CategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenusRepository extends JpaRepository<MenusEntity, Long> {
    List<MenusEntity> findByMenuCategoryNo(CategoryEntity menuCategoryNo);
}
