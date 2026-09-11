# Timetable Maker (Thời Gian Biểu Học Sinh) - Knowledge Information (KI)

## 1. Thông Tin Trực Tuyến & Lưu Trữ (Online Deployment)
- **Đường dẫn chạy Online (Public URL)**: [https://vyntk210906-glitch.github.io/thoi-gian-bieu/](https://vyntk210906-glitch.github.io/thoi-gian-bieu/)
- **GitHub Repository**: [https://github.com/vyntk210906-glitch/thoi-gian-bieu](https://github.com/vyntk210906-glitch/thoi-gian-bieu)
- **Phương thức triển khai**: GitHub Pages (tự động cập nhật khi push commit lên nhánh `master`, hoàn toàn miễn phí, hỗ trợ mọi thiết bị di động, máy tính bảng và desktop).

## 2. Tổng quan Dự án
- **Mục đích**: Ứng dụng web tạo và in bảng thời gian biểu học sinh theo phong cách đồ họa dễ thương (tương đồng với ảnh mẫu `1954f172-7a3a-49b3-bd2a-e96e364c6e85.jpeg`), thiết kế như một tác phẩm văn phòng phẩm (stationery art poster) cute, thoáng đãng, dễ đọc, dễ nhớ.
- **Khả năng cốt lõi**:
  1. **Hệ thống Quản lý Đa Hồ Sơ Các Bé (Multi-Profile System - Cấp độ 1)**:
     - **Cấu trúc dữ liệu**: Lưu trữ toàn bộ hồ sơ trong `localStorage` tại key `thoi_gian_bieu_profiles_v1`:
       ```json
       {
         "activeProfileId": "profile-1",
         "profiles": [
           {
             "id": "profile-1",
             "studentName": "Trịnh Xuân Khang",
             "mascotTheme": "boys",
             "themePalette": "rainbow",
             "layoutMode": "photo",
             "title": "THỜI GIAN BIỂU",
             "subtitle": "",
             "cards": [...]
           }
         ]
       }
       ```
     - **Tương thích ngược tuyệt đối (Backward Compatibility Migration)**: Tự động phát hiện và chuyển đổi dữ liệu đơn từ `thoi_gian_bieu_state_v4` sang hồ sơ bé đầu tiên, đảm bảo người dùng cũ không bao giờ bị mất dữ liệu.
     - **Thanh chọn bé trên Toolbar**: Cho phép chuyển đổi tức thì giữa các bé; tiêu đề banner, linh vật đại diện (`👦`, `👧`, `👫`), tông màu và bảng in lập tức đồng bộ theo bé được chọn.
     - **Tạo Bé Mới (`➕ Bé Mới`)**: Cho phép nhập tên bé, chọn linh vật riêng, tông màu cute, bố cục in, và tùy chọn lịch khởi tạo (sao chép lịch từ bé hiện tại, nạp mẫu chuẩn 7 ngày, mẫu 6 ngày học + ghi chú, hoặc bảng trống).
     - **Nhân Bản / Sao Chép Lịch Trình (`📋 Chép Lịch`)**: Hỗ trợ 2 chế độ:
       - Tạo ngay bé mới với toàn bộ thời gian biểu của bé nguồn (cực kỳ hữu ích cho gia đình có bé thứ 2, thứ 3).
       - Ghi đè lịch trình sang một bé đã có trong danh sách.
     - **Xóa Hồ Sơ (`🗑️`)**: Xóa hồ sơ bé không còn sử dụng (tự động khóa/ẩn khi chỉ còn 1 bé duy nhất).
     - **Sao Lưu & Khôi Phục Dữ Liệu (`💾 Sao Lưu` & `📂 Khôi Phục`)**:
       - Xuất toàn bộ dữ liệu tất cả các bé thành file chuẩn `Thoi_Gian_Bieu_Sao_Luu_YYYY-MM-DD.json`.
       - Khôi phục 1 chạm từ file `.json` trên thiết bị khác (chuyển đổi giữa máy cơ quan, máy tính ở nhà, hay điện thoại di động). Hỗ trợ cả file cấu trúc đơn và cấu trúc đa hồ sơ.
  2. **Bộ Chọn Khung Giờ Hoạt Động Thông Minh (Smart Time Picker & Period Chips)**:
     - **Dropdown giờ trực quan**: 2 ô chọn `Từ:` và `Đến:` với bước nhảy 15/30 phút chuẩn (`06h00` đến `23h00`), loại bỏ phiền toái khi phải gõ tay định dạng giờ.
     - **Chuyển đổi 1 chạm mốc giờ đơn**: Nút `⏱️ 1 mốc giờ` cho phép chuyển linh hoạt giữa khoảng giờ (VD: `07h30 - 11h50`) và mốc giờ đơn lẻ (VD: `16h45` xe bus đón, `22h00` đi ngủ).
     - **Đồng bộ 2 chiều (Bi-directional Sync)**: Khi chọn dropdown hoặc click chip mẫu, ô nhập text tự động cập nhật; ngược lại, khi phụ huynh gõ tay vào ô text, dropdowns tự động nhận diện và cập nhật tương ứng mà không làm mất văn bản tùy chỉnh.
     - **Thẻ giờ nhanh theo phân đoạn buổi (Period Chips)**: 20 khung giờ học sinh thực tế được phân loại qua các tab `Tất cả`, `🌅 Sáng`, `🍱 Trưa`, `⛅ Chiều`, `🌙 Tối`.
     - **Tự động gợi ý tiêu đề buổi**: Tự động nhận diện mốc giờ để điền nhãn phân đoạn (`Sáng:`, `Trưa:`, `Chiều:`, `Tối:`) nếu phụ huynh chưa chọn.
  3. **Chuẩn 7 Khối Tuần (Thứ 2 - Chủ Nhật) + Khối Ghi Chú Tùy Chọn**:
     - Mẫu chuẩn mặc định thiết lập đúng 7 ngày trong tuần (Thứ 2, Thứ 3, Thứ 4, Thứ 5, Thứ 6, Thứ 7, Chủ Nhật).
     - Khối "Ghi Chú & Mục Tiêu" là tùy chọn bổ sung: người dùng có thể kích hoạt qua danh mục mẫu (Mẫu 6 Ngày Học + Ghi Chú) hoặc tự thêm mới khi xóa bớt 1 ngày.
     - Giới hạn khống chế nghiêm ngặt: **TỐI ĐA 7 KHỐI** (`MAX_CARDS = 7`) trên bảng in để đảm bảo bố cục luôn thoáng đãng, không bị chật chội. Nút chức năng hiển thị trực tiếp số lượng khối hiện có: `➕ Thêm Khối (X/7)`.
  4. **Bố cục Hiển thị Cân đối & Thuật toán Xếp Lưới Thông minh (`computeCardLayout`)**:
     - **Nguyên nhân lỗi trước đây**:
       - Khi người dùng thu nhỏ Thứ 2 thành 1 tầng (`spanRows: 1`) và mở rộng Thứ 7 thành 2 tầng (`spanRows: 2`), CSS Grid duyệt DOM theo thứ tự (T2..T5 lấp đầy Hàng 1, T7 bị đẩy sang Hàng 2 sinh ra Hàng thứ 3 ngầm định).
       - Đồng thời, khối Thứ 2 chứa tới 10 hoạt động từ mẫu cũ. Trong CSS Grid, `1fr` có giá trị ngầm định là `minmax(auto, 1fr)`. Do đó, 10 hoạt động của Thứ 2 làm Hàng 1 phình to lên ~600px, kéo cả bảng `.timetable-sheet` dãn dài ngoằng thành hình chữ nhật đứng (> 1300px), đẩy Hàng 2 đâm thủng đáy tờ A4, trong khi Thứ 7 (2 tầng) lại bị rỗng hoác 70%.
     - **Giải pháp xử lý triệt để**:
       - **Khóa cứng tỉ lệ A4 Landscape chuẩn**: `.timetable-sheet` được gán kích thước cố định `width: 1080px; height: 764px; max-height: 764px; min-height: 764px; aspect-ratio: 297 / 210; overflow: hidden;`.
       - **Khóa cứng tỉ lệ phân bổ hàng 50% / 50%**: Lưới sử dụng `grid-template-rows: minmax(0, 1fr) minmax(0, 1fr);` và `overflow: hidden;`. Ngăn chặn hoàn toàn việc một khối có nhiều hoạt động làm phình to một hàng hay làm lệch hàng còn lại.
       - **Hệ thống Co Giãn Chữ & Loại Bỏ Triệt Để Thanh Cuộn (Zero Scrollbar & Dynamic Copy-Fitting)**:
         - **Nguyên nhân gây ra thanh cuộn trước đây**:
           - Trong giao diện web trước đây, `.card-slots` được gán `overflow-y: auto;`. Khi một ngày có nhiều hoạt động (như Thứ 2 có 10 hoạt động + 2 nhãn phân buổi "Chiều", "Tối"), hoặc Thứ 5 (6 hoạt động), Thứ 6 (5 hoạt động + 2 nhãn), tổng chiều cao thực tế `scrollHeight` (251px - 484px) vượt quá chiều cao có sẵn của ô 1 tầng (`clientHeight` ~245px - 255px).
           - Trình duyệt tự động hiển thị thanh cuộn dọc (scrollbar). Vì đây là trang web dựng bản in A4, người dùng không thể "cuộn" trên giấy in, dẫn đến việc toàn bộ hoạt động bên dưới thanh cuộn bị mất / che khuất hoàn toàn khi in.
           - Đồng thời, CSS cũ chứa các selector tĩnh `:first-child` và `:last-child` áp đặt cứng `gap: 8px` lên Thứ 2 ngay cả khi Thứ 2 đã được chuyển về 1 tầng; và bản in `@media print` có các quy tắc `!important` cố định cỡ chữ `0.82rem !important` làm triệt tiêu khả năng co giãn chữ.
         - **Giải pháp loại bỏ scrollbar và bảo đảm 100% hiển thị trên bản in (v5.1)**:
           - **Xóa bỏ hoàn toàn thanh cuộn**: `.card-slots` được đặt `overflow: hidden;` trên màn hình (tuyệt đối không xuất hiện thanh cuộn dù ở bất kỳ độ phân giải nào) và `overflow: visible !important;` trên bản in.
           - **Hệ thống 6 cấp độ mật độ tự thích ứng (6 Density Tiers)**: Dựa trên tổng số mục (`slots.length + số nhãn phân buổi`) và chiều cao ô (`spanRows: 1` hay `2` / bố cục 1 hàng):
             1. `density-spacious` (Khối 2 tầng / toàn chiều cao ít hoạt động $\le 7$): font `0.92rem`, icon `1.15rem`, gap `5px`, padding `3.5px 5px`.
             2. `density-normal` (Khối 1 tầng $\le 4$ mục, hoặc 2 tầng 8-10 mục): font `0.84rem`, icon `1.05rem`, gap `4px`, padding `2px 3px`.
             3. `density-moderate` (Khối 1 tầng 5-6 mục, hoặc 2 tầng 11-13 mục): font `0.77rem`, icon `0.95rem`, gap `3.5px`, padding `1.5px 2px`.
             4. `density-compact` (Khối 1 tầng 7-8 mục): font `0.72rem`, icon `0.86rem`, gap `3px`, padding `1px 2px`.
             5. `density-dense` (Khối 1 tầng 9-11 mục): font `0.66rem`, icon `0.78rem`, gap `2.5px`, padding `0.5px 1.5px`.
             6. `density-ultra` (Khối 1 tầng $\ge 12$ mục): font `0.60rem`, icon `0.70rem`, gap `2px`, padding `0.2px 1px`.
           - **Dàn trang từng block ngày theo chiều dọc (Vertical Slot Layout) & Giữ khoảng cách dòng chuẩn (Standard Line Spacing)**:
             - **Kiến trúc bố cục dọc (`layout-vertical`)**: Mốc thời gian (`.slot-time`) nằm ở dòng trên in đậm rõ nét, nội dung hoạt động (`.slot-text`) nằm ở dòng riêng ngay bên dưới, biểu tượng emoji (`.slot-icon-badge`) đóng vai trò bullet icon gọn gàng bên trái.
             - **Khoảng cách dòng tiêu chuẩn tự nhiên (Standard Spacing, No Artificial Stretch)**: Giữ nguyên khoảng cách dòng theo tiêu chuẩn typographic chuẩn (`justify-content: flex-start`, `gap: calc(var(--slot-row-gap, 3px) * var(--auto-scale, 1))`). Tuyệt đối không kéo giãn dòng (`không dùng space-between / space-around`) để tránh hiện tượng các dòng bị thưa thớt, xa nhau gượng gạo khi một ngày có ít hoạt động.
             - **Khống chế kích thước chữ tối đa (Strict Font Size Cap)**: Kích thước chữ to nhất tuyệt đối không vượt quá mẫu to nhất hiện tại (`density-spacious`: max font `0.92rem` ~ 14.72px, icon `1.15rem`, divider `0.90rem`). Cỡ chữ được tính toán thích ứng theo số lượng mục mà không bị phóng đại quá cỡ.
             - **Cơ chế tự phục hồi 2 pha (Two-Phase Adaptive Fallback)** trong `autoFitCardSlots`:
               - *Pha 1*: Nếu thẻ đang ở chế độ dọc (`layout-vertical`) và nội dung bị tràn (`scrollHeight > clientHeight + 0.5px`), hệ thống tự động hạ cấp thẻ đó sang chế độ ngang (`layout-horizontal`) để bảo toàn không gian mà không làm vỡ bố cục.
               - *Pha 2*: Nếu sau khi chuyển sang chế độ ngang vẫn còn tràn viền, hệ thống mới tiến hành vi điều chỉnh co giãn `--auto-scale` (từ `1.0` xuống `0.97`, `0.94`...).
           - **Thuật toán Tự động Vi điều chỉnh Copy-Fitting (`autoFitCardSlots`)**:
             - Đo đạc chính xác theo thời gian thực: Nếu `scrollHeight > clientHeight + 0.5px`, hàm tự động hạ biến tỉ lệ `--auto-scale` (từ `1.0` xuống `0.97`, `0.94`...) cho đến khi $scrollHeight \le clientHeight$.
             - Tự động kích hoạt khi người dùng gõ sửa chữ trực tiếp (`handleSlotTextInlineInput`), khi thêm/xóa/đổi kích thước ô, khi thay đổi kích thước cửa sổ (`resize`), và trước khi in hoặc xuất file PDF.
             - Đảm bảo 100% nội dung luôn nhìn thấy trọn vẹn, không bị scroll, không bị che khuất và luôn nằm gọn trong 1 trang A4 Landscape duy nhất.
       - **Cache-busting**: Thêm query string `?v=5.2` vào các file CSS/JS trong `index.html` để đảm bảo trình duyệt người dùng luôn tải phiên bản mới nhất, không bị lưu cache cũ.
  5. **Tối ưu Kích thước Chữ (Font Size) Khổ in A4**:
     - Tăng kích thước font chữ toàn diện để bé và phụ huynh dễ dàng quan sát khi dán tường hoặc để bàn:
       - Tiêu đề ngày (`.card-header-pill`): tăng lên `1.02rem` (màn hình) và `0.95rem` (bản in), chiều cao viên thuốc `32px`.
       - Mốc thời gian (`.slot-time`): tăng lên `0.86rem` (màn hình) và `0.82rem` (bản in) với độ đậm `font-weight: 850`.
       - Nội dung hoạt động (`.slot-text`): tăng lên `0.86rem` (màn hình) và `0.82rem` (bản in), độ đậm `font-weight: 700`.
       - Biểu tượng emoji (`.slot-icon-badge`): tăng lên `1.12rem` (màn hình) và `1.05rem` (bản in).
       - Tiêu đề chính (`.banner-main-title`): tăng lên `1.65rem - 1.75rem`.
     - Toàn bộ nội dung vẫn vừa khít hoàn hảo trong đúng **1 trang A4 Landscape duy nhất**.
  6. **Tương tác Kéo Thả Di Chuyển (Drag & Drop Move)**:
     - Kéo biểu tượng tay nắm `⠿` hoặc thanh tiêu đề viên thuốc của bất kỳ ngày nào để đổi chỗ vị trí các ngày trong tuần.
     - Kéo thả trực tiếp từng dòng lịch trình (slot) để sắp xếp lại thứ tự hoặc chuyển hoạt động sang ngày khác.
  7. **Thay đổi kích thước Khối linh hoạt (Card Resize)**:
     - Nút điều chỉnh chiều cao `↕ 1T / 2T`: chuyển đổi giữa 1 tầng và 2 tầng.
     - Nút điều chỉnh bề ngang `↔ 1C / 2C`: mở rộng khối sang 2 cột.
     - Nút xóa khối `🗑️` kèm tính năng khôi phục tức thì.
  8. **Chỉnh sửa Trực quan Trực tiếp (WYSIWYG Inline Editing)**:
     - Nhấp chuột trực tiếp vào tên ngày, mốc giờ, hoặc tên hoạt động để sửa ngay trên bảng in.
     - Tự động nhận diện từ khóa tiếng Việt thời gian thực (real-time Vietnamese icon auto-match) khi đang gõ chữ.
  9. **Khay Hoạt Động Nhanh (Quick Activities Drag Tray)**:
     - Khay hoạt động nằm ở đầu trang hỗ trợ kéo thả nhanh vào các ngày trong tuần.
  10. **Hệ thống Hoàn tác / Làm lại (Undo / Redo Stack)**:
     - Hỗ trợ nút `Hoàn tác` / `Làm lại` trên thanh công cụ và phím tắt chuẩn (`Ctrl+Z`, `Ctrl+Y`).
  11. **Xuất file PDF & In ấn chuẩn A4 Tuyệt đối sạch sẽ**:
     - 100% các nút thao tác (`+ Thêm hoạt động`, `✏️`, `🗑️`, `🎨`, `▲`, `▼`, tay nắm kéo thả `⠿`, huy hiệu `1T/2T`, khay hoạt động nhanh, thanh công cụ) được ẩn hoàn toàn khi in.
  12. **Tự động lưu**: Lưu toàn bộ thay đổi vào `localStorage` (`thoi_gian_bieu_profiles_v1` & `thoi_gian_bieu_state_v4`).

## 3. Kiến trúc & Cấu trúc Thư mục
- `/home/video-system/thoi-gian-bieu/`
  - `index.html`: Cấu trúc DOM chuẩn ngữ nghĩa, thanh chọn hồ sơ các bé, thanh công cụ Undo/Redo, Khay hoạt động nhanh, khung bảng in A4 và các modal quản lý (Modal Hoạt động với Smart Time Picker, Modal Bé Mới, Modal Chép Lịch, Modal Sửa Tiêu Đề).
  - `css/style.css`: Hệ thống biến màu, Google Fonts (`Baloo 2`, `Nunito`, `Quicksand`), hiệu ứng chữ 3D vector, layout 4 cột (`grid-photo`), 7 cột (`grid-7cols`), 5 cột (`grid-photo5`) với `grid-auto-flow: dense`, cỡ chữ in A4 lớn, giao diện Smart Time Picker & Period Chips, giao diện Profile Selector, và quy tắc in `@media print` cho khổ A4 Landscape.
  - `js/icons.js`: Bộ từ điển từ khóa tiếng Việt thông minh, phân loại icon theo nhóm và logic so khớp ranh giới từ (word boundary).
  - `js/presets.js`: Dữ liệu mẫu ban đầu: Mẫu chuẩn 7 ngày (T2 - CN), Mẫu 7 cột dàn đều, Mẫu 6 ngày học + Ghi chú (tổng 7 khối), Mẫu 5 ngày học bán trú.
  - `js/app.js`: Quản lý trạng thái đa hồ sơ (`profilesState`), Smart Time Picker logic, lịch sử undo/redo, xử lý sự kiện kéo thả thẻ và hoạt động, giới hạn tối đa 7 khối, thay đổi kích thước thẻ, chỉnh sửa inline WYSIWYG, sao lưu / khôi phục JSON và xuất PDF sạch.
  - `assets/`:
    - `boy_left_auth.png`: Bé trai bên trái chuẩn ảnh gốc tách nền trong suốt.
    - `boy_right_auth.png`: Bé trai bên phải chuẩn ảnh gốc tách nền trong suốt.
    - `cute_stationery_bg.svg`: Nền thảm đồ họa cute họa tiết tổ ong và mây trời pastel.
    - `stars.svg`: Ngôi sao vàng trang trí.
    - `boy-left.svg`, `boy-right.svg`, `girl-left.svg`, `girl-right.svg`: Bộ linh vật vector dự phòng.
