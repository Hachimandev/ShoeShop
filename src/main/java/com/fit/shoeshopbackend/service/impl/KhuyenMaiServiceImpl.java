package com.fit.shoeshopbackend.service.impl;

import com.fit.shoeshopbackend.dto.KhuyenMaiRequest;
import com.fit.shoeshopbackend.model.KhuyenMai;
import com.fit.shoeshopbackend.model.NhanVien;
import com.fit.shoeshopbackend.repository.KhuyenMaiRepository;
import com.fit.shoeshopbackend.repository.NhanVienRepository;
import com.fit.shoeshopbackend.service.KhuyenMaiService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.text.DecimalFormat;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class KhuyenMaiServiceImpl implements KhuyenMaiService {

    private final KhuyenMaiRepository khuyenMaiRepository;
    private final NhanVienRepository nhanVienRepository;

    @Override
    public List<KhuyenMai> layTatCaKhuyenMai() {
        return khuyenMaiRepository.findAll();
    }

    @Override
    public KhuyenMai layKhuyenMaiTheoMa(String maKhuyenMai) {
        return khuyenMaiRepository.findById(maKhuyenMai)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khuyến mãi"));
    }

    private String generateNewMaKhuyenMai() {
        String maxId = khuyenMaiRepository.findMaxMaKhuyenMai();
        int nextNumber = 1;

        if (maxId != null && maxId.startsWith("KM")) {
            try {
                String numberPart = maxId.substring(2);
                nextNumber = Integer.parseInt(numberPart) + 1;
            } catch (NumberFormatException e) {
                nextNumber = 1;
            }
        }

        DecimalFormat df = new DecimalFormat("000");
        return "KM" + df.format(nextNumber);
    }

    @Override
    @Transactional
    public KhuyenMai themKhuyenMai(KhuyenMaiRequest request) {
        NhanVien nhanVien = null;
        if (request.getMaNhanVien() != null) {
            nhanVien = nhanVienRepository.findById(request.getMaNhanVien())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên"));
        }

        String newMaKhuyenMai = generateNewMaKhuyenMai();

        KhuyenMai khuyenMai = KhuyenMai.builder()
                .maKhuyenMai(newMaKhuyenMai)
                .ngayBatDau(request.getNgayBatDau())
                .ngayKetThuc(request.getNgayKetThuc())
                .dieuKien(request.getDieuKien())
                .chietKhau(request.getChietKhau())
                .nhanVien(nhanVien)
                .build();

        return khuyenMaiRepository.save(khuyenMai);
    }

    @Override
    @Transactional
    public KhuyenMai capNhatKhuyenMai(String maKhuyenMai, KhuyenMaiRequest request) {
        KhuyenMai khuyenMai = khuyenMaiRepository.findById(maKhuyenMai)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khuyến mãi"));

        khuyenMai.setNgayBatDau(request.getNgayBatDau());
        khuyenMai.setNgayKetThuc(request.getNgayKetThuc());
        khuyenMai.setDieuKien(request.getDieuKien());
        khuyenMai.setChietKhau(request.getChietKhau());

        if (request.getMaNhanVien() != null) {
            NhanVien nhanVien = nhanVienRepository.findById(request.getMaNhanVien())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên"));
            khuyenMai.setNhanVien(nhanVien);
        }

        return khuyenMaiRepository.save(khuyenMai);
    }

    @Override
    @Transactional
    public void xoaKhuyenMai(String maKhuyenMai) {
        if (!khuyenMaiRepository.existsById(maKhuyenMai)) {
            throw new RuntimeException("Không tìm thấy khuyến mãi để xóa");
        }
        khuyenMaiRepository.deleteById(maKhuyenMai);
    }

    @Override
    public List<KhuyenMai> timKiemKhuyenMai(String tuKhoa) {
        return khuyenMaiRepository.findByMaKhuyenMaiContainingOrDieuKienContaining(tuKhoa, tuKhoa);
    }

    @Override
    public List<KhuyenMai> layKhuyenMaiHopLe() {
        return khuyenMaiRepository.findKhuyenMaiHopLe(new Date());
    }
}
