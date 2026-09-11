# Timetable Maker (Thời Gian Biểu Học Sinh) - Knowledge Information (KI)

## 1. Thông Tin Trực Tuyến & Lưu Trữ (Online Deployment)
- **Đường dẫn chạy Online (Public URL)**: [https://vyntk210906-glitch.github.io/thoi-gian-bieu/](https://vyntk210906-glitch.github.io/thoi-gian-bieu/)
- **GitHub Repository**: [https://github.com/vyntk210906-glitch/thoi-gian-bieu](https://github.com/vyntk210906-glitch/thoi-gian-bieu)
- **Phương thức triển khai**: GitHub Pages (tự động cập nhật khi push commit lên nhánh `master`, hoàn toàn miễn phí, hỗ trợ mọi thiết bị di động, máy tính bảng và desktop).

## 2. Tổng quan Dự án
- **Mục đích**: Ứng dụng web tạo và in bảng thời gian biểu học sinh theo phong cách đồ họa dễ thương (tương đồng 100% với ảnh mẫu `1954f172-7a3a-49b3-bd2a-e96e364c6e85.jpeg`), thiết kế như một tác phẩm văn phòng phẩm (stationery art poster) cute, thoáng đãng, dễ đọc, dễ nhớ.
- **Khả năng cốt lõi**:
  1. **Bố cục Chuẩn 7 Ngày + Khối Ghi Chú & Mục Tiêu linh hoạt**:
     - Chuẩn hóa 1 tuần chỉ có 7 ngày (Thứ 2 đến Chủ Nhật) + Khối Mục tiêu & Lời dặn tuần mới (loại bỏ hoàn toàn lỗi trùng 2 ngày Thứ 6 trong ảnh mẫu).
     - Hệ thống lưới CSS Grid tự động phân bố (`grid-auto-flow: dense;`):
       - Cột 1 (THỨ HAI): Chiều cao 2 tầng (`spanRows: 2`).
       - Cột 2: THỨ BA (trên, 1 tầng) & THỨ SÁU (dưới, 1 tầng).
       - Cột 3: THỨ TƯ (trên, 1 tầng) & THỨ BẢY (dưới, 1 tầng).
       - Cột 4: THỨ NĂM (trên, 1 tầng) & CHỦ NHẬT (dưới, 1 tầng).
       - Cột 5: GHI CHÚ & MỤC TIÊU: Chiều cao 2 tầng (`spanRows: 2`).
  2. **Tương tác Kéo Thả Di Chuyển (Drag & Drop Block Move)**:
     - Kéo biểu tượng tay nắm `⠿` hoặc thanh tiêu đề viên thuốc của bất kỳ ngày nào để đổi chỗ vị trí các ngày trong tuần trực quan.
     - Kéo thả trực tiếp từng dòng lịch trình (slot) để sắp xếp lại thứ tự hoặc chuyển hoạt động sang ngày khác.
  3. **Thay đổi kích thước Khối linh hoạt (Card Resize)**:
     - Nút điều chỉnh chiều cao `↕ 1T / 2T`: chuyển đổi giữa 1 tầng (chiều cao nửa trang) hoặc 2 tầng (toàn bộ cột dọc trang).
     - Nút điều chỉnh bề ngang `↔ 1C / 2C`: mở rộng khối sang 2 cột cho các ngày học nhiều hoặc bảng ghi chú rộng.
     - Nút xóa khối `🗑️` kèm tính năng khôi phục / hoàn tác tức thì.
  4. **Chỉnh sửa Trực quan Trực tiếp (WYSIWYG Inline Editing)**:
     - Người dùng có thể nhấp trực tiếp vào tên ngày, khung giờ, hoặc tên hoạt động trên bảng in để sửa ngay lập tức mà không bắt buộc phải mở popup.
     - Tự động nhận diện từ khóa tiếng Việt thời gian thực (real-time Vietnamese icon auto-match) khi đang gõ chữ.
  5. **Khay Hoạt Động Nhanh (Quick Activities Drag Tray)**:
     - Bố trí ngay trên đầu bảng in, hiển thị danh sách các hoạt động học sinh phổ biến (Học tại trường, Ngủ trưa, BTVN, Thể thao, Tắm rửa, Ăn tối, Đi ngủ,...).
     - Hỗ trợ kéo thả trực tiếp một hoạt động từ khay vào bất kỳ thẻ ngày nào để thêm lịch ngay trong tích tắc.
  6. **Hệ thống Hoàn tác / Làm lại (Undo / Redo Stack)**:
     - Hỗ trợ nút `Hoàn tác` / `Làm lại` trên thanh công cụ và phím tắt chuẩn (`Ctrl+Z`, `Ctrl+Y`).
  7. **Thiết kế nghệ thuật & Dễ thương (Cute Stationery Art)**:
     - Nền thảm xanh pastel nhẹ nhàng với họa tiết tổ ong và cụm mây trắng mờ trang nhã (`cute_stationery_bg.svg`).
     - Banner tiêu đề viên thuốc xanh dương rực rỡ bo tròn viền đậm, chữ 3D nổi bật (`Baloo 2` & `Nunito`), chữ trắng viền xanh đậm và tên bé màu vàng tươi viền nâu hổ phách với kỹ thuật `paint-order: stroke fill;`.
     - Linh vật chibi học sinh chuẩn ảnh gốc (`boy_left_auth.png`, `boy_right_auth.png`) đứng tự nhiên ở mép trên cột 1 và cột 5.
     - Biểu tượng emoji cute inline tinh tế, không bị đóng khung tròn rườm rà.
  8. **Xuất file PDF & In ấn chuẩn A4 Tuyệt đối sạch sẽ**:
     - Khi bấm In hoặc Xuất PDF, toàn bộ 100% các nút thao tác (`+ Thêm hoạt động`, `✏️`, `🗑️`, `🎨`, `▲`, `▼`, tay nắm kéo thả `⠿`, huy hiệu kích thước `1T/2T`, khay hoạt động nhanh, thanh công cụ) được ẩn hoàn toàn.
     - Bảng in tự động co giãn vừa vặn hoàn hảo trong đúng 1 trang A4 Ngang duy nhất (A4 Landscape), không tràn trang.
  9. **Tự động lưu**: Lưu toàn bộ thay đổi vào `localStorage` (`thoi_gian_bieu_state_v3`).

## 3. Kiến trúc & Cấu trúc Thư mục
- `/home/video-system/thoi-gian-bieu/`
  - `index.html`: Cấu trúc DOM chuẩn ngữ nghĩa, thanh điều hướng Undo/Redo, Khay hoạt động nhanh, khung bảng in A4 và các modal quản lý.
  - `css/style.css`: Hệ thống biến màu, Google Fonts (`Baloo 2`, `Nunito`, `Quicksand`), hiệu ứng chữ 3D vector, layout 5 cột linh hoạt với `grid-auto-flow: dense`, hiệu ứng kéo thả, và quy tắc in `@media print` cho khổ A4 Landscape.
  - `js/icons.js`: Bộ từ điển từ khóa tiếng Việt thông minh, phân loại icon theo nhóm và logic so khớp ranh giới từ (word boundary).
  - `js/presets.js`: Dữ liệu mẫu ban đầu: Mẫu gốc chuẩn 7 ngày + Ghi chú, Mẫu 7 ngày dàn đều, Mẫu 5 ngày học bán trú.
  - `js/app.js`: Quản lý trạng thái, lịch sử undo/redo, xử lý sự kiện kéo thả thẻ và hoạt động, thay đổi kích thước thẻ, chỉnh sửa inline WYSIWYG, lưu trữ và xuất PDF sạch.
  - `assets/`:
    - `boy_left_auth.png`: Bé trai bên trái chuẩn ảnh gốc tách nền trong suốt.
    - `boy_right_auth.png`: Bé trai bên phải chuẩn ảnh gốc tách nền trong suốt.
    - `cute_stationery_bg.svg`: Nền thảm đồ họa cute họa tiết tổ ong và mây trời pastel.
    - `stars.svg`: Ngôi sao vàng trang trí.
    - `boy-left.svg`, `boy-right.svg`, `girl-left.svg`, `girl-right.svg`: Bộ linh vật vector dự phòng.
