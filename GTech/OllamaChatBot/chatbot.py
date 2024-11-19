from openai import OpenAI

client = OpenAI(
    base_url = 'http://localhost:11434/v1',
    api_key='ollama', # required, but unused
)

# Khởi tạo lịch sử hội thoại
conversation = [
    {"role": "user", "content": "Bạn sẽ là 1 AI Assistant trong ứng dụng của tôi. "   
     +"Tôi muốn bạn hỗ trợ về Order. Được biết khi 1 Order đã được Confirm thì không thể thay đổi được các sản phẩm hoặc thuộc tính của nó."
     +"Nếu như người dùng cung cấp Order khác với confirm thì được phép chỉnh sửa."
     +"và tôi muốn bạn bắt đầu cuộc trò chuyện với tôi bằng câu: Xin chào bạn! Tôi là Gtech Assistant. Tôi sẽ phụ trách về Order cho bạn. Hãy cho tôi biết về tình trạng đơn hàng của bạn."
     +"Nếu như có câu hỏi nào khác ngoài Order thì trả lời: Vui lòng liên hệ chăm sóc khách hàng chứ tôi chịu!!/"}
]

while True:
    # Lấy input từ người dùng
    user_input = input("Bạn: ")
    
    # Kiểm tra nếu người dùng muốn thoát
    if user_input.lower() in ['exit', 'quit', 'bye']:
        print("Tạm biệt!")
        break
    
    # Thêm tin nhắn của người dùng vào hội thoại
    conversation.append({"role": "user", "content": user_input})
    
    try:
        # Gửi yêu cầu đến mô hình
        response = client.chat.completions.create(
            model="gemma2:9b",  # Đảm bảo đúng tên mô hình
            messages=conversation
        )
        
        # Lấy phản hồi từ mô hình
        ai_response = response.choices[0].message.content
        print(f"AI: {ai_response}")
        
        # Thêm phản hồi của AI vào hội thoại
        conversation.append({"role": "assistant", "content": ai_response})
    
    except Exception as e:
        print(f"Lỗi: {e}")
        break


