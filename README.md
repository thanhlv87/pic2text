# Trình Trích Xuất Văn Bản Từ Hình Ảnh

Một ứng dụng web đơn giản nhưng mạnh mẽ sử dụng API Gemini của Google để trích xuất văn bản từ hình ảnh được tải lên một cách chính xác.

![Giao diện ứng dụng](https://i.imgur.com/example.png) <!-- Bạn có thể thay thế link này bằng ảnh chụp màn hình ứng dụng của bạn -->

## ✨ Tính năng

-   **Giao diện Hiện đại:** Thiết kế đẹp mắt, trực quan và tối ưu cho thiết bị di động.
-   **Tải lên Dễ dàng:** Hỗ trợ kéo-thả hoặc chọn tệp tin hình ảnh (PNG, JPG, WEBP, v.v.).
-   **Trích xuất Nhanh chóng:** Sử dụng mô hình `gemini-2.5-flash` để nhận diện và trích xuất văn bản gần như ngay lập tức.
-   **Sao chép Tiện lợi:** Dễ dàng sao chép toàn bộ văn bản kết quả chỉ với một cú nhấp chuột.

## 🚀 Cách triển khai

Ứng dụng này được thiết kế để triển khai dễ dàng lên **GitHub Pages** bằng GitHub Actions.

1.  **Fork/Clone repository này.**
2.  **Tạo Secret cho API Key:**
    -   Trong repository của bạn, đi tới `Settings` > `Secrets and variables` > `Actions`.
    -   Nhấn `New repository secret`.
    -   Đặt tên secret là `GEMINI_API_KEY`.
    -   Dán Google AI API key của bạn vào ô `Secret`.
3.  **Kích hoạt GitHub Pages:**
    -   Trong repository, đi tới `Settings` > `Pages`.
    -   Trong phần `Build and deployment`, chọn `Source` là **`GitHub Actions`**.

Bây giờ, mỗi khi bạn đẩy code lên `main branch`, quy trình trong `.github/workflows/deploy.yml` sẽ tự động chạy và triển khai trang web của bạn.

## 🛠️ Công nghệ sử dụng

-   **React:** Thư viện JavaScript để xây dựng giao diện người dùng.
-   **Tailwind CSS:** Framework CSS để tạo kiểu nhanh chóng.
-   **Google Gemini API:** Dịch vụ AI để thực hiện việc trích xuất văn bản.
-   **GitHub Actions:** Tự động hóa quy trình triển khai.
