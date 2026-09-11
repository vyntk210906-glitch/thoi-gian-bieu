# Timetable Maker (Thời Gian Biểu Học Sinh) - Knowledge Information (KI)

## 1. Tổng quan Dự án
- **Mục đích**: Ứng dụng web tạo và in bảng thời gian biểu học sinh theo phong cách đồ họa dễ thương (tương đồng 100% với ảnh mẫu `1954f172-7a3a-49b3-bd2a-e96e364c6e85.jpeg`).
- **Khả năng**:
  1. Tự động nhận diện từ khóa tiếng Việt trong hoạt động để gán biểu tượng (icon) phù hợp.
  2. Hỗ trợ thao tác thêm, xóa, sửa (CRUD) chi tiết từng hoạt động, khung giờ, cột ngày và tiêu đề.
  3. Xuất file PDF trực tiếp chất lượng cao (300 DPI) bằng thư viện `html2pdf.js`.
  4. Hỗ trợ lệnh in chuẩn trình duyệt (`Ctrl+P` / `window.print()`) chuẩn khổ giấy A4 Ngang (A4 Landscape) với định dạng vector sắc nét, tự căn chỉnh vừa vặn trong 1 trang duy nhất không bị tràn.
  5. Tự động lưu dữ liệu vào `localStorage` của trình duyệt.

## 2. Kiến trúc & Cấu trúc Thư mục
- `/home/video-system/thoi-gian-bieu/`
  - `index.html`: Cấu trúc DOM, thanh điều hướng thao tác, thanh công cụ thiết lập, khung bảng in A4 và các modal chỉnh sửa.
  - `css/style.css`: Quy tắc giao diện thẻ, font chữ Quicksand/Nunito/Comfortaa, hiệu ứng 3D chữ tiêu đề, linh vật hoạt hình, và `@media print` cho khổ A4 Landscape.
  - `js/icons.js`: Bộ từ điển từ khóa tiếng Việt thông minh, logic so khớp ranh giới từ (word boundary) và danh mục icon thủ công.
  - `js/presets.js`: Dữ liệu mẫu ban đầu: Mẫu gốc (Trịnh Xuân Khang - 10 ô), Mẫu 7 ngày tiêu chuẩn, Mẫu 5 ngày học bán trú.
  - `js/app.js`: Quản lý trạng thái (state management), render giao diện, xử lý sự kiện modal, kéo thả sắp xếp, lưu trữ và xuất PDF.
  - `assets/`: Vector SVG minh họa học sinh nam, nữ, sao lấp lánh và mây trời:
    - `boy-left.svg`: Bé trai bên trái (đồng phục cà vạt đỏ).
    - `boy-right.svg`: Bé trai bên phải (áo xanh, đeo cặp, cầm sách cam).
    - `girl-left.svg`: Bé gái bên trái (áo hồng cột tóc).
    - `girl-right.svg`: Bé gái bên phải (áo tím, cầm sách xanh).
    - `stars.svg`: Ngôi sao vàng trang trí.

## 3. Cơ chế Khớp Biểu Tượng Thông Minh (Smart Icon Matcher)
- **Chuẩn hóa chuỗi (`normalizeText`)**: Loại bỏ dấu tiếng Việt, chuyển chữ thường, thay thế ký tự đặc biệt bằng khoảng trắng.
- **Ranh giới từ (Word Boundary Matching)**:
  - Để tránh lỗi so khớp chuỗi con (ví dụ: từ "ăn" bị khớp nhầm trong "tiếng anh", "toán", "đàn", "bạn"), hệ thống bao bọc chuỗi nguồn và từ khóa bằng khoảng trắng (`' ' + normText + ' '`).
- **Ưu tiên độ dài từ khóa (Longest-Match First)**:
  - Toàn bộ luật được sắp xếp giảm dần theo độ dài ký tự (`keyword.length`). Cụm từ dài và chi tiết hơn (ví dụ: `bài tập về nhà`, `hoàn thành btvn`, `về nhà ăn tối`, `tiếng anh`) sẽ được kiểm tra trước các từ khóa ngắn (`học`, `về nhà`, `ăn`).
- **Ghi đè thủ công**: Khi người dùng tự tay chọn một icon từ bảng biểu tượng hoặc nhập emoji tùy ý, cờ `isIconManuallyChosen` sẽ khóa icon đó lại để không bị từ khóa tự động thay đổi.

## 4. Cơ chế Xuất PDF & In Ấn Chuẩn A4
- **Chế độ In Trực Tiếp (`window.print()`)**:
  - CSS `@page { size: A4 landscape; margin: 4mm; }`.
  - Bật `-webkit-print-color-adjust: exact; print-color-adjust: exact;` để giữ nguyên màu nền gradient, màu viên nang (pill) và viền.
  - Ẩn toàn bộ thanh công cụ (`.no-print`), các nút sửa/xóa/thêm.
  - Thu gọn kích thước card và padding để toàn bộ 10 cột/ô vừa khít hoàn toàn trên 1 trang giấy A4 mà không bị đẩy sang trang thứ 2.
- **Chế độ Tải File PDF Trực Tiếp (`html2pdf.js`)**:
  - Tích hợp sẵn gói `html2pdf.bundle.min.js` cục bộ (hoạt động offline).
  - Cấu hình scale 3 (độ phân giải cao ~300 DPI), canvas renderer chuẩn A4 ngang.
