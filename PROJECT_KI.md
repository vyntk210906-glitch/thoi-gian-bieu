# Timetable Maker (Thời Gian Biểu Học Sinh) - Knowledge Information (KI)

## 1. Thông Tin Trực Tuyến & Lưu Trữ (Online Deployment)
- **Đường dẫn chạy Online (Public URL)**: [https://vyntk210906-glitch.github.io/thoi-gian-bieu/](https://vyntk210906-glitch.github.io/thoi-gian-bieu/)
- **GitHub Repository**: [https://github.com/vyntk210906-glitch/thoi-gian-bieu](https://github.com/vyntk210906-glitch/thoi-gian-bieu)
- **Phương thức triển khai**: GitHub Pages (tự động cập nhật khi push commit lên nhánh `master`, hoàn toàn miễn phí, hỗ trợ mọi thiết bị di động, máy tính bảng và desktop).

## 2. Tổng quan Dự án
- **Mục đích**: Ứng dụng web tạo và in bảng thời gian biểu học sinh theo phong cách đồ họa dễ thương (tương đồng với ảnh mẫu `1954f172-7a3a-49b3-bd2a-e96e364c6e85.jpeg`), thiết kế như một tác phẩm văn phòng phẩm (stationery art poster) cute, thoáng đãng, dễ đọc, dễ nhớ.
- **Khả năng cốt lõi**:
  1. **Chuẩn 7 Khối Tuần (Thứ 2 - Chủ Nhật) + Khối Ghi Chú Tùy Chọn**:
     - Mẫu chuẩn mặc định thiết lập đúng 7 ngày trong tuần (Thứ 2, Thứ 3, Thứ 4, Thứ 5, Thứ 6, Thứ 7, Chủ Nhật).
     - Khối "Ghi Chú & Mục Tiêu" là tùy chọn bổ sung: người dùng có thể kích hoạt qua danh mục mẫu (Mẫu 6 Ngày Học + Ghi Chú) hoặc tự thêm mới khi xóa bớt 1 ngày.
     - Giới hạn khống chế nghiêm ngặt: **TỐI ĐA 7 KHỐI** (`MAX_CARDS = 7`) trên bảng in để đảm bảo bố cục luôn thoáng đãng, không bị chật chội. Nút chức năng hiển thị trực tiếp số lượng khối hiện có: `➕ Thêm Khối (X/7)`.
  2. **Bố cục Hiển thị Cân đối (CSS Grid với `grid-auto-flow: dense`)**:
     - **Bố cục 2 tầng - 4 Cột (`grid-photo`)**:
       - Cột 1 (THỨ HAI): Chiều cao 2 tầng (`spanRows: 2`), rộng 1.15fr.
       - Cột 2: THỨ BA (trên, 1 tầng) & THỨ SÁU (dưới, 1 tầng).
       - Cột 3: THỨ TƯ (trên, 1 tầng) & THỨ BẢY (dưới, 1 tầng).
       - Cột 4: THỨ NĂM (trên, 1 tầng) & CHỦ NHẬT (dưới, 1 tầng).
       - Tổng cộng 7 ngày lấp đầy chính xác lưới 4×2, không có ô trống, không sinh thêm hàng thứ 3.
     - **Bố cục 7 Cột dàn đều (`grid-7cols`)**: 7 cột hiển thị song song từ Thứ 2 đến Chủ Nhật.
     - **Bố cục 5 Cột (`grid-photo5`)**: Dành riêng cho mẫu có khối Ghi chú (Thứ 2 và Ghi Chú cao 2 bên, các ngày ở giữa).
  3. **Tối ưu Kích thước Chữ (Font Size) Khổ in A4**:
     - Tăng kích thước font chữ toàn diện để bé và phụ huynh dễ dàng quan sát khi dán tường hoặc để bàn:
       - Tiêu đề ngày (`.card-header-pill`): tăng lên `1.02rem` (màn hình) và `0.95rem` (bản in), chiều cao viên thuốc `32px`.
       - Mốc thời gian (`.slot-time`): tăng lên `0.86rem` (màn hình) và `0.82rem` (bản in) với độ đậm `font-weight: 850`.
       - Nội dung hoạt động (`.slot-text`): tăng lên `0.86rem` (màn hình) và `0.82rem` (bản in), độ đậm `font-weight: 700`.
       - Biểu tượng emoji (`.slot-icon-badge`): tăng lên `1.12rem` (màn hình) và `1.05rem` (bản in).
       - Tiêu đề chính (`.banner-main-title`): tăng lên `1.65rem - 1.75rem`.
     - Toàn bộ nội dung vẫn vừa khít hoàn hảo trong đúng **1 trang A4 Landscape duy nhất**.
  4. **Tương tác Kéo Thả Di Chuyển (Drag & Drop Move)**:
     - Kéo biểu tượng tay nắm `⠿` hoặc thanh tiêu đề viên thuốc của bất kỳ ngày nào để đổi chỗ vị trí các ngày trong tuần.
     - Kéo thả trực tiếp từng dòng lịch trình (slot) để sắp xếp lại thứ tự hoặc chuyển hoạt động sang ngày khác.
  5. **Thay đổi kích thước Khối linh hoạt (Card Resize)**:
     - Nút điều chỉnh chiều cao `↕ 1T / 2T`: chuyển đổi giữa 1 tầng và 2 tầng.
     - Nút điều chỉnh bề ngang `↔ 1C / 2C`: mở rộng khối sang 2 cột.
     - Nút xóa khối `🗑️` kèm tính năng khôi phục tức thì.
  6. **Chỉnh sửa Trực quan Trực tiếp (WYSIWYG Inline Editing)**:
     - Nhấp chuột trực tiếp vào tên ngày, mốc giờ, hoặc tên hoạt động để sửa ngay trên bảng in.
     - Tự động nhận diện từ khóa tiếng Việt thời gian thực (real-time Vietnamese icon auto-match) khi đang gõ chữ.
  7. **Khay Hoạt Động Nhanh (Quick Activities Drag Tray)**:
     - Khay hoạt động nằm ở đầu trang hỗ trợ kéo thả nhanh vào các ngày trong tuần.
  8. **Hệ thống Hoàn tác / Làm lại (Undo / Redo Stack)**:
     - Hỗ trợ nút `Hoàn tác` / `Làm lại` trên thanh công cụ và phím tắt chuẩn (`Ctrl+Z`, `Ctrl+Y`).
  9. **Xuất file PDF & In ấn chuẩn A4 Tuyệt đối sạch sẽ**:
     - 100% các nút thao tác (`+ Thêm hoạt động`, `✏️`, `🗑️`, `🎨`, `▲`, `▼`, tay nắm kéo thả `⠿`, huy hiệu `1T/2T`, khay hoạt động nhanh, thanh công cụ) được ẩn hoàn toàn khi in.
  10. **Tự động lưu**: Lưu toàn bộ thay đổi vào `localStorage` (`thoi_gian_bieu_state_v4`).

## 3. Kiến trúc & Cấu trúc Thư mục
- `/home/video-system/thoi-gian-bieu/`
  - `index.html`: Cấu trúc DOM chuẩn ngữ nghĩa, thanh điều hướng Undo/Redo, Khay hoạt động nhanh, khung bảng in A4 và các modal quản lý.
  - `css/style.css`: Hệ thống biến màu, Google Fonts (`Baloo 2`, `Nunito`, `Quicksand`), hiệu ứng chữ 3D vector, layout 4 cột (`grid-photo`), 7 cột (`grid-7cols`), 5 cột (`grid-photo5`) với `grid-auto-flow: dense`, cỡ chữ in A4 lớn, và quy tắc in `@media print` cho khổ A4 Landscape.
  - `js/icons.js`: Bộ từ điển từ khóa tiếng Việt thông minh, phân loại icon theo nhóm và logic so khớp ranh giới từ (word boundary).
  - `js/presets.js`: Dữ liệu mẫu ban đầu: Mẫu chuẩn 7 ngày (T2 - CN), Mẫu 7 cột dàn đều, Mẫu 6 ngày học + Ghi chú (tổng 7 khối), Mẫu 5 ngày học bán trú.
  - `js/app.js`: Quản lý trạng thái, lịch sử undo/redo, xử lý sự kiện kéo thả thẻ và hoạt động, giới hạn tối đa 7 khối, thay đổi kích thước thẻ, chỉnh sửa inline WYSIWYG, lưu trữ và xuất PDF sạch.
  - `assets/`:
    - `boy_left_auth.png`: Bé trai bên trái chuẩn ảnh gốc tách nền trong suốt.
    - `boy_right_auth.png`: Bé trai bên phải chuẩn ảnh gốc tách nền trong suốt.
    - `cute_stationery_bg.svg`: Nền thảm đồ họa cute họa tiết tổ ong và mây trời pastel.
    - `stars.svg`: Ngôi sao vàng trang trí.
    - `boy-left.svg`, `boy-right.svg`, `girl-left.svg`, `girl-right.svg`: Bộ linh vật vector dự phòng.
