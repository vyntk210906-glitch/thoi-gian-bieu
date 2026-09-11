# Timetable Maker (Thời Gian Biểu Học Sinh) - Knowledge Information (KI)

## 1. Thông Tin Trực Tuyến & Lưu Trữ (Online Deployment)
- **Đường dẫn chạy Online (Public URL)**: [https://vyntk210906-glitch.github.io/thoi-gian-bieu/](https://vyntk210906-glitch.github.io/thoi-gian-bieu/)
- **GitHub Repository**: [https://github.com/vyntk210906-glitch/thoi-gian-bieu](https://github.com/vyntk210906-glitch/thoi-gian-bieu)
- **Phương thức triển khai**: GitHub Pages (tự động cập nhật khi push commit lên nhánh `master`, hoàn toàn miễn phí, hỗ trợ mọi thiết bị di động, máy tính bảng và desktop).

## 2. Tổng quan Dự án
- **Mục đích**: Ứng dụng web tạo và in bảng thời gian biểu học sinh theo phong cách đồ họa dễ thương (tương đồng 100% với ảnh mẫu `1954f172-7a3a-49b3-bd2a-e96e364c6e85.jpeg`), thiết kế như một tác phẩm văn phòng phẩm (stationery art poster) cute, thoáng đãng, dễ đọc, dễ nhớ.
- **Khả năng**:
  1. **Bố cục chuẩn ảnh gốc 100% (5 cột)**:
     - Cột 1 (THỨ HAI): Chiều cao trọn vẹn 2 hàng (Sáng, Chiều, Tối).
     - Cột 2: THỨ BA (trên) & THỨ SÁU (dưới).
     - Cột 3: THỨ TƯ (trên) & THỨ BẢY (dưới).
     - Cột 4: THỨ NĂM (trên) & CHỦ NHẬT (dưới).
     - Cột 5: THỨ SÁU (chiều cao trọn vẹn 2 hàng).
  2. **Thiết kế nghệ thuật & Dễ thương (Cute Stationery Art)**:
     - Nền thảm xanh pastel nhẹ nhàng với họa tiết tổ ong và cụm mây trắng mờ trang nhã (`cute_stationery_bg.svg`).
     - Banner tiêu đề viên thuốc xanh dương rực rỡ bo tròn viền đậm, chữ 3D nổi bật (`Baloo 2` & `Nunito`), chữ trắng viền xanh đậm và tên bé màu vàng tươi viền nâu hổ phách với kỹ thuật `paint-order: stroke fill;`.
     - Linh vật chibi học sinh chuẩn ảnh gốc (`boy_left_auth.png`, `boy_right_auth.png`) đứng tự nhiên ở mép trên cột 1 và cột 5.
     - Các thẻ ngày nền trắng tinh khôi, viền màu tươi đồng bộ với viên thuốc tiêu đề (Thứ 2: Xanh dương `#1d72b8`, Thứ 3: Xanh lá `#239546`, Thứ 4: Vàng `#e8a825`, Thứ 5: Đỏ `#df2528`, Thứ 6: Cam `#f16323`, Thứ 7: Tím `#7842a2`, CN: Xanh ngọc `#0b9195`).
     - Biểu tượng emoji cute inline tinh tế, không bị đóng khung tròn rườm rà.
  3. **Tự động nhận diện từ khóa tiếng Việt**: Tự động gán biểu tượng (icon) phù hợp khi người dùng nhập nội dung hoạt động.
  4. **Tái sử dụng hoạt động & Áp dụng nhiều ngày**:
     - Kho hoạt động thường dùng của học sinh chọn nhanh bằng 1 click.
     - Tính năng "Áp dụng cho các ngày": Thêm/sửa 1 hoạt động đồng thời cho Thứ 2 - Thứ 6 hoặc tất cả các ngày.
     - Tính năng "Sao chép cột / ngày": Nhân bản toàn bộ lịch trình sang các ngày khác.
  5. **Xuất file PDF & In ấn chuẩn A4 Tuyệt đối sạch sẽ**:
     - Khi bấm In hoặc Xuất PDF, toàn bộ các nút thao tác (`+ Thêm hoạt động`, `✏️`, `🗑️`, `🎨`, `▲`, `▼`, thanh công cụ) được ẩn hoàn toàn 100%.
     - Bảng in tự động co giãn vừa vặn hoàn hảo trong đúng 1 trang A4 Ngang duy nhất (A4 Landscape), không tràn trang.
  6. **Tự động lưu**: Lưu toàn bộ thay đổi vào `localStorage`.

## 3. Kiến trúc & Cấu trúc Thư mục
- `/home/video-system/thoi-gian-bieu/`
  - `index.html`: Cấu trúc DOM chuẩn ngữ nghĩa, thanh điều hướng, công cụ thiết lập, khung bảng in A4 và các modal chức năng.
  - `css/style.css`: Hệ thống biến màu, font chữ Google Fonts (`Baloo 2`, `Nunito`, `Quicksand`), hiệu ứng chữ 3D vector, layout 5 cột chính xác, thẻ văn phòng phẩm và quy tắc in `@media print` cho khổ A4 Landscape.
  - `js/icons.js`: Bộ từ điển từ khóa tiếng Việt thông minh, logic so khớp ranh giới từ (word boundary).
  - `js/presets.js`: Dữ liệu mẫu ban đầu: Mẫu gốc chuẩn ảnh mẫu (Trịnh Xuân Khang), Mẫu 7 ngày tiêu chuẩn, Mẫu 5 ngày học bán trú.
  - `js/app.js`: Quản lý trạng thái, render giao diện, xử lý sự kiện modal, tái sử dụng hoạt động, nhân bản ngày, lưu trữ và xuất PDF sạch.
  - `assets/`:
    - `boy_left_auth.png`: Bé trai bên trái chuẩn ảnh gốc tách nền trong suốt.
    - `boy_right_auth.png`: Bé trai bên phải chuẩn ảnh gốc tách nền trong suốt.
    - `cute_stationery_bg.svg`: Nền thảm đồ họa cute họa tiết tổ ong và mây trời pastel.
    - `stars.svg`: Ngôi sao vàng trang trí.
    - `boy-left.svg`, `boy-right.svg`, `girl-left.svg`, `girl-right.svg`: Bộ linh vật vector dự phòng.
