package com.fit.shoeshopbackend.dto;

import lombok.Data;
import java.util.Date;

@Data
public class KhuyenMaiRequest {
    private String maKhuyenMai;
    private Date ngayBatDau;
    private Date ngayKetThuc;
    private String dieuKien;
    private double chietKhau;
    private String maNhanVien;
}
