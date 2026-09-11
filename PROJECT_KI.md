# Timetable Maker (Thời Gian Biểu Học Sinh) - Knowledge Information (KI)

## 1. Thông Tin Trực Tuyến & Lưu Trữ (Online Deployment)
- **Đường dẫn chạy Online (Public URL)**: [https://vyntk210906-glitch.github.io/thoi-gian-bieu/](https://vyntk210906-glitch.github.io/thoi-gian-bieu/)
- **GitHub Repository**: [https://github.com/vyntk210906-glitch/thoi-gian-bieu](https://github.com/vyntk210906-glitch/thoi-gian-bieu)
- **Phương thức triển khai**: GitHub Pages (tự động cập nhật khi push commit lên nhánh `master`, hoàn toàn miễn phí, hỗ trợ mọi thiết bị di động, máy tính bảng và desktop).

## 2. Tổng quan Dự án
- **Mục đích**: Ứng dụng web tạo và in bảng thời gian biểu học sinh theo phong cách đồ họa dễ thương (tương đồng 100% với ảnh mẫu `1954f172-7a3a-49b3-bd2a-e96e364c6e85.jpeg`), tối ưu cho học sinh với giao diện trực quan, font chữ to rõ ràng, icon sinh động và các công cụ tái sử dụng lịch tiện lợi.
- **Khả năng**:
  1. **Tự động nhận diện từ khóa tiếng Việt**: Tự động gán biểu tượng (icon) phù hợp khi người dùng nhập nội dung.
  2. **Tái sử dụng hoạt động & Áp dụng nhiều ngày**:
     - Kho hoạt động thường dùng của học sinh (Học chính tại trường, Ngủ trưa, Bài tập về nhà, Thể thao, Ăn tối, Đi ngủ...) chọn nhanh bằng 1 click.
     - Tính năng "Áp dụng cho các ngày": Chọn thêm hoặc sửa 1 hoạt động đồng thời cho Thứ 2 - Thứ 6 hoặc tất cả các ngày chỉ với 1 click.
     - Tính năng "Sao chép cột / ngày": Nhân bản toàn bộ lịch trình của một ngày sang các ngày khác nhanh chóng.
  3. **Tùy biến thẩm mỹ**: 4 bộ màu cute (Cầu vồng tươi vui, Xanh da trời mây biếc, Kẹo hồng ngọt ngào, Vườn xanh tươi mát) và tùy chọn linh vật (Bé trai, Bé gái, Cả hai).
  4. **Xuất file PDF trực tiếp chất lượng cao (300 DPI)** bằng thư viện `html2pdf.js`.
  5. **Hỗ trợ lệnh in chuẩn trình duyệt (`Ctrl+P` / `window.print()`)**: Khổ giấy A4 Ngang (A4 Landscape) với định dạng vector sắc nét, tự căn chỉnh vừa vặn trong 1 trang duy nhất không bị tràn.
  6. **Tự động lưu**: Lưu toàn bộ thay đổi vào `localStorage`.

## 3. Kiến trúc & Cấu trúc Thư mục
- `/home/video-system/thoi-gian-bieu/`
  - `index.html`: Cấu trúc DOM, thanh điều hướng, thanh công cụ thiết lập, khung bảng in A4 và các modal (Thêm/Sửa hoạt động, Sao chép ngày, Đổi màu cột, Sửa tiêu đề).
  - `css/style.css`: Quy tắc giao diện thẻ, font chữ Quicksand/Nunito/Comfortaa, sticker icon hình tròn, hiệu ứng 3D chữ tiêu đề, linh vật hoạt hình, và `@media print` cho khổ A4 Landscape.
  - `js/icons.js`: Bộ từ điển từ khóa tiếng Việt thông minh, logic so khớp ranh giới từ (word boundary) và danh mục icon thủ công.
  - `js/presets.js`: Dữ liệu mẫu ban đầu: Mẫu gốc (Trịnh Xuân Khang - 10 ô), Mẫu 7 ngày tiêu chuẩn, Mẫu 5 ngày học bán trú.
  - `js/app.js`: Quản lý trạng thái (state management), render giao diện, xử lý sự kiện modal, tái sử dụng hoạt động, nhân bản ngày, lưu trữ và xuất PDF.
  - `assets/`: Vector SVG minh họa học sinh nam, nữ, sao lấp lánh và mây trời:
    - `boy-left.svg`: Bé trai bên trái (đồng phục cà vạt đỏ).
    - `boy-right.svg`: Bé trai bên phải (áo xanh, đeo cặp, cầm sách cam).
    - `girl-left.svg`: Bé gái bên trái (áo hồng cột tóc).
    - `girl-right.svg`: Bé gái bên phải (áo tím, cầm sách xanh).
    - `stars.svg`: Ngôi sao vàng trang trí.
