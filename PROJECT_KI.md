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
  2. **Bố cục Hiển thị Cân đối & Thuật toán Xếp Lưới Thông minh (`computeCardLayout`)**:
     - **Nguyên nhân lỗi trước đây**: Khi người dùng thu nhỏ Thứ 2 thành 1 tầng (`spanRows: 1`) và mở rộng Thứ 7 thành 2 tầng (`spanRows: 2`), CSS Grid duyệt DOM theo thứ tự (T2, T3, T4, T5, T6, T7, CN). Các khối 1 tầng T2..T5 lấp đầy Hàng 1 (Cols 1..4), dẫn đến khi duyệt đến T7 (nằm ở Hàng 2) với `grid-row: span 2`, trình duyệt bắt buộc phải sinh ra **Hàng thứ 3 ngầm định (implicit Row 3)**. Hàng 3 này làm vỡ khung cố định của tờ A4, đẩy đáy khối trồi ra ngoài trang in và để lại khoảng trắng lớn ở góc dưới bên phải (Cột 4 Hàng 2).
     - **Giải pháp xử lý triệt để**:
       - Xây dựng thuật toán giải vị trí động `computeCardLayout(cards, layoutMode)` trong `js/app.js`:
         - Nhận diện các khối 2 tầng (chiều cao trọn cột) và các khối 1 tầng (tiêu chuẩn).
         - Phân bổ cột độc quyền cho các khối 2 tầng dựa trên chỉ số vị trí tương đối trong danh sách ngày (ví dụ: Thứ 2 ở đầu -> Cột 1; Thứ 7 ở cuối -> Cột 4; Ghi chú -> Cột 5).
         - Tự động ghép cặp các khối 1 tầng vào các cột còn trống: nửa đầu vào Hàng 1 (nửa trên), nửa sau vào Hàng 2 (nửa dưới) theo đúng quy luật đọc từ trái sang phải.
         - Gán tọa độ tường minh `gridColumn: col / span 1` và `gridRow: row / span spanRows` cho từng khối DOM, tuyệt đối không để CSS Grid tự đoán vị trí.
         - Thiết lập bề rộng cột động: cột 2 tầng nhận `1.15fr` (rộng rãi hơn do nhiều hoạt động), các cột 1 tầng nhận `1fr`.
       - **Bố cục 2 tầng - 4 Cột (`grid-photo`)**:
         - Khi Thứ 2 là 2 tầng: Cột 1 là Thứ 2; Cột 2..4 là T3..CN xếp đôi (trên: T3, T4, T5; dưới: T6, T7, CN).
         - Khi Thứ 7 là 2 tầng: Cột 4 là Thứ 7; Cột 1..3 là T2..CN xếp đôi (trên: T2, T3, T4; dưới: T5, T6, CN).
         - Hoàn toàn vừa khít lưới 4×2, chính xác 2 hàng, 0 hàng thừa, 0 ô trống.
       - **Bố cục 7 Cột dàn đều (`grid-7cols`)**: 7 cột hiển thị song song từ Thứ 2 đến Chủ Nhật.
       - **Bố cục 5 Cột (`grid-photo5`)**: Dành riêng cho mẫu có khối Ghi chú (Thứ 2 và Ghi Chú cao 2 bên, các ngày ở giữa).
       - Bất kể người dùng kéo thả đổi thứ tự hay bật/tắt 1T/2T ở bất kỳ ngày nào, bố cục luôn tự động căn chỉnh hoàn mỹ và vừa khít đúng 1 trang A4 Landscape duy nhất.
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
