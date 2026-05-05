package com.fit.shoeshopbackend.service;

import com.fit.shoeshopbackend.dto.KhuyenMaiRequest;
import com.fit.shoeshopbackend.model.KhuyenMai;
import java.util.List;

public interface KhuyenMaiService {
    List<KhuyenMai> layTatCaKhuyenMai();
    KhuyenMai layKhuyenMaiTheoMa(String maKhuyenMai);
    KhuyenMai themKhuyenMai(KhuyenMaiRequest request);
    KhuyenMai capNhatKhuyenMai(String maKhuyenMai, KhuyenMaiRequest request);
    void xoaKhuyenMai(String maKhuyenMai);
    List<KhuyenMai> timKiemKhuyenMai(String tuKhoa);
    List<KhuyenMai> layKhuyenMaiHopLe();
}
