package com.sol.gf.domain.image;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Entity
@Table(name = "tb_img")
public class ImgEntity {

    @Id
    private Long img_no;

    private String img_type;  // 예: "image/png"

    @Lob
    private byte[] img;
}